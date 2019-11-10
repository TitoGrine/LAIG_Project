#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D cameraTex;
uniform sampler2D noiseText;

uniform float timeFactor;

const float BLACK_INTENSITY = 1.2;
const float NLINES = 4.5;
const float LINE_PRECISION = 3.0;
const float LINE_AMPLITUDE = 0.25;

const float BACK_INTENSITY = 8.;

void main() {
    vec4 color = texture2D(cameraTex, vTextureCoord);

	// TODO: brincar com valores

	float border_animation = BLACK_INTENSITY ;
	float black_border = ( 1.0 - border_animation * distance(vec2(0.5, 0.5), vTextureCoord ));

	// timeFactor + ... -> to move downwards instead of oscilating in the middle	
	float stripe_animation = timeFactor + sin(timeFactor + 2.2 * cos(timeFactor * 0.9));
	float stripes = mod(vTextureCoord.y * NLINES * LINE_PRECISION + stripe_animation, LINE_PRECISION);

	// * vec(..., ...) -> grao. qt maior mais granulado
	float noise = texture2D(noiseText, vTextureCoord * vec2(0.4, .8) + vec2(1., sin(timeFactor))).x;
	noise = pow(noise, 3.) / 3.;

	if(stripes > (LINE_PRECISION - LINE_AMPLITUDE))
		color +=  stripes * noise;
	
	// TODO: refactor
	float noise_bck = texture2D(noiseText, vTextureCoord * vec2(2.5, 2.5) + vec2(1., sin(timeFactor))).x;
	noise_bck = pow(noise_bck, 2.) / 5.;

	color += noise_bck;

	// 20 lines; + X ) / X -> must be the same
	color *= (mod(vTextureCoord.y * 20. + timeFactor , 1.) + BACK_INTENSITY) / BACK_INTENSITY;

    gl_FragColor = vec4(color.rgb *  black_border, 1.0);
}