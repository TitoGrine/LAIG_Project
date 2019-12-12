/**
* MyCylinder
* @constructor
* @param {Reference to MyScene object} scene 
* @param {Cylinder ID} id
* @param {Radius of the Base Circle} base_radius 
* @param {Radius of the Top Circle} top_radius 
* @param {Height of the Cylinder} height 
* @param {Number of divisions around the circunference} slices 
* @param {Number of divisions along the height} stacks 
*/
class MyCylinder extends CGFobject {
    constructor(scene, id, base_radius, top_radius, height, slices, stacks) {
        super(scene);

        this.id = id;
        this.base_radius = base_radius;
        this.top_radius = top_radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
		this.normals = [];
		this.texCoords = [];

        var alpha = (2 * Math.PI)/this.slices;                          // Circle increment
        var delta = this.height / this.stacks;                          // Height increment
        var theta = (this.top_radius - this.base_radius) / this.stacks; // Circle radius increment

        for(var i = 0; i <= this.slices; i++){
            for(var j = 0; j <= this.stacks; j++){
				// vertices
                this.vertices.push((this.base_radius + theta * j) * Math.cos(alpha * i), (this.base_radius + theta * j) * Math.sin(alpha * i), delta * j);

				// normals
                this.normals.push(Math.cos(alpha * i), Math.sin(alpha * i), 0);

				// texture coordinates
                this.texCoords.push( i / this.slices, 1 - j / this.stacks);
            }
        }
		
		// indices
        for(var i = 0; i < this.slices; i++){
            for(var j = 0; j < this.stacks; j++){
                this.indices.push((this.stacks + 1) * (i + 1) + j, (this.stacks + 1) * (i + 1) + (j + 1), (this.stacks + 1) * i + j);
                this.indices.push((this.stacks + 1) * i + (j + 1), (this.stacks + 1) * i + j, (this.stacks + 1) * (i + 1) + (j + 1));
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

	// Does nothing: quadric Text Coordinates aren't updated
	updateTexCoords(lengthS, lengthT) {

	}
}