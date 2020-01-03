#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 background;
uniform vec4 foreground;

vec4 shade(float offset, vec4 color1, vec4 color2) {
    return clamp(mix(color1, color2, offset), 0., 1.);
}

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float offset = smoothstep(0.23, 0.54, color.r) ;
	
	gl_FragColor = shade(offset, background, foreground);
	// gl_FragColor = vec4(newColor, 1.);

	// if(color.b > 0.4)
	// 	color = vec4(foreground, 1.0);
	// else
	// 	color = vec4(background, 1.0);

	// gl_FragColor = color;
}