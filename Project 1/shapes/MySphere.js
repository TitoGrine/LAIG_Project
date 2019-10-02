/**
* MySphere
* @constructor
*
* @param {*} id 
* @param {*} radius 
* @param {*} slices 
* @param {*} stacks 
*/
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.id = id;
		this.radius = radius;
		this.slices = slices;
        this.stacks = stacks; // Stack is the number of division in the Z axis of half the sphere
        
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

                this.vertices.push(this.radius * Math.cos(theta * i - Math.PI/2.0) * Math.cos(phi * j), this.radius * Math.cos(theta * i - Math.PI/2.0) * Math.sin(phi * j), this.radius * Math.sin(theta * i - Math.PI/2.0));

                this.normals.push(Math.cos(theta * i - Math.PI/2.0) * Math.cos(phi * j), Math.cos(theta * i - Math.PI/2.0) * Math.sin(phi * j), Math.sin(theta * i - Math.PI/2.0));

                this.texCoords.push((phi * j) / (2 * Math.PI), 1 - (theta * i) / Math.PI); // Not sure it works 
			}
		}
		

		for(var j = 0; j < this.slices; j++){	
			for(var i = 0; i < 2 * this.stacks; i++){

                this.indices.push((2 * this.stacks + 1) * (j + 1) + i, (2 * this.stacks + 1) * j + (i + 1), (2 * this.stacks + 1) * j + i);
                this.indices.push((2 * this.stacks + 1) * j + (i + 1), (2 * this.stacks + 1) * (j + 1) + i, (2 * this.stacks + 1) * (j + 1) + (i + 1));
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}
}