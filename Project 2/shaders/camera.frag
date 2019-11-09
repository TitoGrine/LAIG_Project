#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D cameraTex;

void main() {
    vec4 color = texture2D(cameraTex, vTextureCoord);

    gl_FragColor = color;
}