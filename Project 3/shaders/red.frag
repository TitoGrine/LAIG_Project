#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float timeFactor;
uniform sampler2D dateTex;

void main() {
    vec4 color = texture2D(dateTex, vTextureCoord);

    if(color.r == 1.0 && timeFactor > 5.0)
        gl_FragColor = color;
    else
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}