/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.p1 = vec3.fromValues(x1, y1, z1);
    	this.p2 = vec3.fromValues(x2, y2, z2);
    	this.p3 = vec3.fromValues(x3, y3, z3);

		this.initBuffers();
	}

	
	/**
	 *				 . p3 ( c - a * cos(beta), 1 - a * sin(beta))
	 *				/ \
	 * 			   /   \
	 * 			  /		\
	 * 			 /		 \
	 * 			/		  \
	 * 		 b /		   \ a
	 *		  /				\
	 *		 /				 \
	 *		/				  \
	 *	   /				   \
	 *	  /						\
	 *	 /_______________________\
	 * 	p1(0, 1)		c		p2 (1, 1)
	 */
	initBuffers() {
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2],
			this.p2[0], this.p2[1], this.p2[2],
			this.p3[0], this.p3[1], this.p3[2]
		];
		this.indices = [0, 1, 2];

		let v12 = [	this.p2[0] - this.p1[0],
					this.p2[1] - this.p1[1],
					this.p2[2] - this.p1[2]];

		let v13 = [	this.p3[0] - this.p1[0],
					this.p3[1] - this.p1[1],
					this.p3[2] - this.p1[2]];

		let normal = vec3.create();
		vec3.cross(normal, v12, v13);
		vec3.normalize(normal, normal);

		this.normals = [ 
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2]
		];

		this.distA = Math.sqrt( Math.pow( this.p2[0] - this.p3[0], 2) + Math.pow( this.p2[1] - this.p3[1], 2) + Math.pow( this.p2[2] - this.p3[2], 2) );
		this.distB = Math.sqrt( Math.pow( this.p1[0] - this.p3[0], 2) + Math.pow( this.p1[1] - this.p3[1], 2) + Math.pow( this.p1[2] - this.p3[2], 2) );
		this.distC = Math.sqrt( Math.pow( this.p1[0] - this.p2[0], 2) + Math.pow( this.p1[1] - this.p2[1], 2) + Math.pow( this.p1[2] - this.p2[2], 2) );

		this.cosBeta = ( this.distA * this.distA - this.distB * this.distB + this.distC * this.distC ) / ( 2 * this.distA * this.distC );
		this.sinBeta = Math.sqrt( 1 - this.cosBeta * this.cosBeta );

		this.texCoords = [
			0, 1,
			1, 1,
			this.distC - this.distA * this.cosBeta, 1 - this.distA * this.sinBeta
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * 
	 */
	updateTexCoords(lengthS, lengthT) {
		// TODO: ver se é mesmo para por 1 + verificar
		this.texCoords = [
			0, 1,
			this.distC / lengthS, 1,
			(this.distC - this.distA * this.cosBeta) / lengthS, (lengthT - this.distA * this.sinBeta) / lengthT

		];


		
		this.updateTexCoordsGLBuffers();
	}
}

