attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
	// Turns image upside down
	vTextureCoord =  vec2(0.0, 1.0) + vec2(aTextureCoord.x, - aTextureCoord.y);
	gl_Position = vec4(aVertexPosition, 1.0);
}