/**
 * MyTorus
 * @constructor
 * @param {Reference to MyScene object} scene 
 * @param {Torus ID} id
 * @param {Radius of the "tube"} inner 
 * @param {Radius of the "circular axis" of the torus} outer 
 * @param {Number of sides along the inner circle} slices 
 * @param {Number of circles around "tube"} loops 
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);

		this.id = id;
		this.innerRadius = inner;
		this.outerRaidus = outer;
		this.loops = loops;
		this.slices = slices;
		
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var thetaAng = 0;
		var phiAng = 0;
		var thetaInc = 2*Math.PI/this.loops;
		var phiInc = 2*Math.PI/ this.slices;

		for(let j = 0; j <= this.slices; j++){

			for(let i = 0; i <= this.loops; i++){
				
				// vertices
				this.vertices.push( (this.outerRaidus + this.innerRadius * Math.cos(phiAng) ) * Math.cos(thetaAng),
									(this.outerRaidus + this.innerRadius * Math.cos(phiAng) ) * Math.sin(thetaAng),
									this.innerRadius * Math.sin(phiAng));

				// normals
				this.normals.push( Math.cos(phiAng) * Math.cos(thetaAng), Math.cos(phiAng) * Math.sin(thetaAng),  Math.sin( phiAng ));

				// Texture Coordinates
				this.texCoords.push( i / this.loops, j / this.slices);

				thetaAng+=thetaInc;
			}

			phiAng += phiInc;
			thetaAng = 0;
		}

		// indices
		for(var j = 0; j < this.slices; j++)
			for (var i = 0; i < this.loops; i++) {
				this.indices.push( j * (this.loops + 1) + 		i, 	j 		* (this.loops + 1) + 1 + i, (j + 1) * (this.loops + 1) + i);
				this.indices.push( j * (this.loops + 1) +  1 + i, (j + 1) 	* (this.loops + 1) + 1 + i, (j + 1) * (this.loops + 1) + i);
			}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	// Does nothing: quadric Text Coordinates aren't updated
	updateTexCoords(lengthS, lengthT) {

	}
}

