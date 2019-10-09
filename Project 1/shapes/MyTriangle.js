/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param {*} id 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} z1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} z2 
 * @param {*} x3 
 * @param {*} y3 
 * @param {*} z3 
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.id = id;
		
		this.v1 = vec3.fromValues(x1, y1, z1);
    	this.v2 = vec3.fromValues(x2, y2, z2);
    	this.v3 = vec3.fromValues(x3, y3, z3);

		this.initBuffers();
	}

	
	/**
	 *				 . v3 ( c * cos(alpha) / length_u, c * sin(alpha) /length_v)
	 *				/ \
	 * 			   /   \
	 * 			  /		\
	 * 			 /		 \
	 * 			/		  \
	 * 		 c /		   \ b
	 *		  /				\
	 *		 /				 \
	 *		/				  \
	 *	   /				   \
	 *	  /						\
	 *	 /_______________________\
	 * 	v1(0, 0)		a		v2 (1, 0) -> (a/length_u)
	 */
	initBuffers() {
		this.vertices = [
			this.v1[0], this.v1[1], this.v1[2],
			this.v2[0], this.v2[1], this.v2[2],
			this.v3[0], this.v3[1], this.v3[2]
		];
		this.indices = [0, 1, 2];

		let v12 = [	this.v2[0] - this.v1[0],
					this.v2[1] - this.v1[1],
					this.v2[2] - this.v1[2]];

		let v13 = [	this.v3[0] - this.v1[0],
					this.v3[1] - this.v1[1],
					this.v3[2] - this.v1[2]];

		let normal = vec3.create();
		vec3.cross(normal, v12, v13);
		vec3.normalize(normal, normal);

		this.normals = [ 
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2]
		];

		this.distA = Math.sqrt( Math.pow( this.v2[0] - this.v1[0], 2) + Math.pow( this.v2[1] - this.v1[1], 2) + Math.pow( this.v2[2] - this.v1[2], 2) );
		this.distB = Math.sqrt( Math.pow( this.v3[0] - this.v2[0], 2) + Math.pow( this.v3[1] - this.v2[1], 2) + Math.pow( this.v3[2] - this.v2[2], 2) );
		this.distC = Math.sqrt( Math.pow( this.v1[0] - this.v3[0], 2) + Math.pow( this.v1[1] - this.v3[1], 2) + Math.pow( this.v1[2] - this.v3[2], 2) );
		
		this.cosAlpha = ( this.distA * this.distA - this.distB * this.distB + this.distC * this.distC ) / ( 2 * this.distA * this.distC );
		this.sinAlpha = Math.sqrt( 1 - this.cosAlpha * this.cosAlpha );

		this.texCoords = [
			0, 1,
			1, 1,
			this.distC * this.cosAlpha, this.distC * this.sinAlpha
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	//TODO: preencher {*}
	/**
	 * @method updateTexCoords
	 * 
	 * @param {*} lengthS 
	 * @param {*} lengthT 
	 */
	updateTexCoords(lengthS, lengthT) {
		this.texCoords = [
			0, 0,
			this.distA / lengthS, 0,
			(this.distC * this.cosAlpha) / lengthS, (this.distC * this.sinAlpha) / lengthT
		];
		
		this.updateTexCoordsGLBuffers();
	}
}

