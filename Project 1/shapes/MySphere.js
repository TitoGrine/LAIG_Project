/**
* MySphere
* @constructor
* @param {Reference to MyScene object} scene 
* @param {Sphere ID} id 
* @param {Radius of the sphere} radius 
* @param {Number of divisions around axis} slices 
* @param {Number of divisions from pole to the equator line} stacks 
*/
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.id = id;
		this.radius = radius;
		this.slices = slices;
        this.stacks = stacks;
        
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
		this.normals = [];
		this.texCoords = [];

        var phi = (2 * Math.PI) / this.slices;
        var theta = Math.PI / (2 * this.stacks);

		for(var j = 0; j <= this.slices; j++){	
			for(var i = 0; i <= 2 * this.stacks; i++){

				// Vertices
                this.vertices.push(this.radius * Math.cos(theta * i - Math.PI/2.0) * Math.cos(phi * j), this.radius * Math.cos(theta * i - Math.PI/2.0) * Math.sin(phi * j), this.radius * Math.sin(theta * i - Math.PI/2.0));

				// Normals
                this.normals.push(Math.cos(theta * i - Math.PI/2.0) * Math.cos(phi * j), Math.cos(theta * i - Math.PI/2.0) * Math.sin(phi * j), Math.sin(theta * i - Math.PI/2.0));

				// Texture Coordinates
                this.texCoords.push(1 - (phi * j) / (2 * Math.PI), (theta * i) / Math.PI);                
            }
		}
		
		// Indices
		for(var j = 0; j < this.slices; j++){	
			for(var i = 0; i < 2 * this.stacks; i++){
                this.indices.push((2 * this.stacks + 1) * j + i, (2 * this.stacks + 1) * (j + 1) + i, (2 * this.stacks + 1) * j + (i + 1));
                this.indices.push((2 * this.stacks + 1) * (j + 1) + i, (2 * this.stacks + 1) * (j + 1) + (i + 1), (2 * this.stacks + 1) * j + (i + 1));
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}

	// Does nothing: quadric Text Coordinates aren't updated
	updateTexCoords(lengthS, lengthT) {

	}
}