/**
* MyCylinder
* @constructor
* @param {Reference to MyScene object} scene 
* TODO: comentar
* @param {*} id
* @param {*} base_radius 
* @param {*} top_radius 
* @param {*} height 
* @param {*} slices 
* @param {*} stacks 
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
                this.vertices.push((this.base_radius + theta * j) * Math.cos(alpha * i), (this.base_radius + theta * j) * Math.sin(alpha * i), delta * j);

                this.normals.push(Math.cos(alpha * i), Math.sin(alpha * i), 0);

                this.texCoords.push( i / this.slices, 1 - j / this.stacks);
            }
        }
        
        for(var i = 0; i < this.slices; i++){
            for(var j = 0; j < this.stacks; j++){
                this.indices.push((this.stacks + 1) * (i + 1) + j, (this.stacks + 1) * (i + 1) + (j + 1), (this.stacks + 1) * i + j);
                this.indices.push((this.stacks + 1) * i + (j + 1), (this.stacks + 1) * i + j, (this.stacks + 1) * (i + 1) + (j + 1));
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}