#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D cameraTex;
uniform sampler2D noiseText;

uniform float timeFactor;

const float BLACK_INTENSITY = 1.4;

const float NLINES = 4.5;
const float LINE_PRECISION = 3.0;
const float LINE_AMPLITUDE = 0.25;

const float BACKGROUND_INTENSITY = 8.;

// Calculates noise
float noise(float vec2X, float vec2Y, float noisePower, float noiseQuot) {
	float ret = texture2D(noiseText, vTextureCoord * vec2(vec2X, vec2Y) + vec2(1., sin(timeFactor))).x;
	return (pow(ret, noisePower) / noiseQuot);
}

void main() {
    vec4 color = texture2D(cameraTex, vTextureCoord);

	// Calculate black border
	float black_border = ( 1.0 - BLACK_INTENSITY * distance(vec2(0.5, 0.5), vTextureCoord ));

	// timeFactor + ... -> to move downwards instead of oscilating in the middle	
	float stripe_animation = timeFactor + sin(timeFactor + 2.2 * cos(timeFactor * 0.9));
	float stripes = mod(vTextureCoord.y * NLINES * LINE_PRECISION + stripe_animation, LINE_PRECISION);

	// * vec(..., ...) -> grao. qt maior mais granulado
	// Calculate noise for the lines
	float line_noise = noise(0.4, 0.8, 3.0, 3.0);

	if(stripes > (LINE_PRECISION - LINE_AMPLITUDE))
		color +=  stripes * line_noise;
		
	// Calculate noise for the background
	float background_noise = noise(2.5, 2.5, 2., 5.);
	color += background_noise;

	// Final Color
	color *= (mod(vTextureCoord.y * 20. + timeFactor , 1.) + BACKGROUND_INTENSITY) / BACKGROUND_INTENSITY;

    gl_FragColor = vec4(color.rgb *  black_border, 1.0);
}