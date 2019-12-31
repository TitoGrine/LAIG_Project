attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
	vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y);

	gl_Position = vec4(aVertexPosition, 1.0);
}