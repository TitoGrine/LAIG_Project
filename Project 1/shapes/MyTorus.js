/**
 * MyTorus
 * @constructor
 * @param {Reference to MyScene object} scene 
 * TODO: comentar
 * @param {*} inner 
 * @param {*} outer 
 * @param {*} slices 
 * @param {*} loops 
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);

		this.id = id;
		this.innerRadius = inner;
		this.outerRaidus = outer;
		this.slices = slices;
		this.loops = loops;
		
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		// radius = outer; tube = inner; tubularSegments = slices; radialSegments = loops

		var thetaAng = 0;
		var phiAng = 0;
		var thetaInc = 2*Math.PI/this.slices;
		var phiInc = 2*Math.PI/ this.loops;

		for(let j = 0; j <= this.loops; j++){

			for(let i = 0; i <= this.slices; i++){
				
				this.vertices.push( (this.outerRaidus + this.innerRadius * Math.cos(phiAng) ) * Math.cos(thetaAng),
									(this.outerRaidus + this.innerRadius * Math.cos(phiAng) ) * Math.sin(thetaAng),
									this.innerRadius * Math.sin(phiAng));

				this.normals.push( Math.cos(phiAng) * Math.cos(thetaAng), Math.cos(phiAng) * Math.sin(thetaAng),  Math.sin( phiAng ));

				// var x = (this.outerRaidus + this.innerRadius * Math.cos( phiAng ) ) * Math.cos( thetaAng ) - this.outerRaidus * Math.cos( thetaAng );
				// var y = (this.outerRaidus + this.innerRadius * Math.cos( phiAng ) ) * Math.sin( thetaAng ) - this.outerRaidus * Math.sin( thetaAng );
				// var z = this.innerRadius * Math.sin( phiAng );
				// TODO: normalizar
				// console.log(x, y, z);
				// this.normals.push(x, y, z);

				this.texCoords.push( i / this.slices, j / this.loops);

				thetaAng+=thetaInc;
			}

			phiAng += phiInc;
			thetaAng = 0;
		}



		for(var j = 0; j < this.loops; j++)
			for (var i = 0; i < this.slices; i++) {
				
				this.indices.push( j * (this.slices + 1) + 		i, 	j 		* (this.slices + 1) + 1 + i, (j + 1) * (this.slices + 1) + i);
				this.indices.push( j * (this.slices + 1) +  1 + i, (j + 1) 	* (this.slices + 1) + 1 + i, (j + 1) * (this.slices + 1) + i);
				
			}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(lengthS, lengthT) {
		// this.updateTexCoordsGLBuffers();
    }
}

