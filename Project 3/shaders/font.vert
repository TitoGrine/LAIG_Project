attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec2 dims;
uniform vec2 charCoords;
uniform	float onScreen;

varying vec2 vTextureCoord;

void main() {
	if(onScreen == 1.)
		gl_Position = vec4(aVertexPosition, 1.0);
	else
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord = (charCoords + aTextureCoord) / dims;
}