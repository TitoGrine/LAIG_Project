#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 background;
uniform vec3 foreground;

vec3 shade(float offset, vec3 color1, vec3 color2) {
    return clamp(mix(color1, color2, offset), 0., 1.);
}

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	float offset = smoothstep(0.23, 0.54, color.r) ;
	
	vec3 newColor = shade(offset, background, foreground);
	gl_FragColor = vec4(newColor, 1.);

	// if(color.b > 0.4)
	// 	color = vec4(foreground, 1.0);
	// else
	// 	color = vec4(background, 1.0);

	// gl_FragColor = color;
}