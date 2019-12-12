/**
 * MyPlane
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Plane ID} id 
 * @param {Number of rows} rows 
 * @param {Number of columns} columns 
 */
class Board extends CGFobject {
	constructor(scene, id, rows, columns) {
        super(scene);
		this.id = id;
        this.rows = rows;
        this.columns = columns;
        this.size = rows * columns;

        //super.init(application);
		this.scene.initCameras();
		this.scene.initLights();
		this.scene.gl.clearColor(0, 0, 0, 1.0);
		this.scene.gl.clearDepth(10000.0);
		this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
		this.scene.gl.enable(this.scene.gl.CULL_FACE);
		this.scene.gl.depthFunc(this.scene.gl.LEQUAL);
        this.scene.setPickEnabled(true);
        
        this.makeBoardSurface();
    }

    /**
     * Creates the NURB surface corresponding to a plane centered in the XZ plane,
     * facing the +Y direction. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeBoardSurface(){
        this.square = new MyPlane(this.scene, 'square', 30, 30);
        this.piece_holder = new MyPlane(this.scene, 'holder', 30, 30);
        this.side = new MyPlane(this.scene, 'side', 30, 30);
        this.dark_tiles = [];
        this.light_tiles = [];

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.dark_tiles.push(new Tile(this.scene, i + 1, j + 1, [0.03, 0.6, 0.8]));
            }
        }

        for(let i = 0; i < 2; i++){
            for(let j = 0; j < this.columns; j++){
                this.light_tiles.push(new Tile(this.scene, i * (1.0 + this.rows), j + 1, [0.0, 0.8, 1.0]));
            }
        }

        for(let i = 0; i < 2; i++){
            for(let j = 0; j < this.rows; j++){
                this.light_tiles.push(new Tile(this.scene, j + 1, i * (1.0 + this.columns), [0.0, 0.8, 1.0]));
            }
        }

        this.tiles = this.dark_tiles.concat(this.light_tiles);
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					    if (obj) {
                            var coords = obj.getCoords();
                            obj.toggle();
						    console.log("Picked object: " + obj + ", with coordenates " + coords);						
                        }
                    
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }
    
    display(){
        this.logPicking();
		this.scene.clearPickRegistration();
		// Clear image and depth buffer every time we update the scene
		this.scene.gl.viewport(0, 0, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
		this.scene.gl.clear(this.scene.gl.COLOR_BUFFER_BIT | this.scene.gl.DEPTH_BUFFER_BIT);
		this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
		// Initialize Model-View matrix as identity (no transformation
		this.scene.updateProjectionMatrix();
		this.scene.loadIdentity();
		// Apply transformations corresponding to the camera position relative to the origin
		this.scene.applyViewMatrix();

        this.scene.pushMatrix();

        this.scene.scale(2.0, 1.0, 2.0);

        this.scene.pushMatrix();
        this.scene.translate(1 + this.columns/2.0, 1.0, 1 + this.rows/2.0);
        this.scene.scale(this.columns, 1.0, this.rows);
        this.square.display();
        this.scene.popMatrix();

        for(let i = 0; i < 2; i++){
            this.scene.pushMatrix();
            this.scene.translate(1.0 + this.columns/2.0, 1.0, 0.5 + (i ? 1.0 + this.rows : 0.0));
            this.scene.scale(this.columns, 1.0, 1.0);
            this.piece_holder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.0 + this.columns/2.0, 0.5, (i ? 2.0 + this.rows : 0.0));
            this.scene.rotate((i ? 1.0 : -1.0) * Math.PI/2.0, 1.0, 0.0, 0.0);
            this.scene.scale(this.columns, 1.0, 1.0);
            this.side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.0 + (i ? this.columns : 0.0), 0.5, 0.5);
            this.scene.rotate((i ? -1.0 : 1.0) * Math.PI/2.0, 0.0, 0.0, 1.0);
            this.side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.0 + (i ? this.columns : 0.0), 0.5, 1.5 + this.rows);
            this.scene.rotate((i ? -1.0 : 1.0) * Math.PI/2.0, 0.0, 0.0, 1.0);
            this.side.display();
            this.scene.popMatrix();
        }

        for(let i = 0; i < 2; i++){
            this.scene.pushMatrix();
            this.scene.translate(0.5 + (i ? 1.0 + this.columns : 0.0), 1.0, 1.0 + this.rows/2.0);
            this.scene.scale(1.0, 1.0, this.rows);
            this.piece_holder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate((i ? 2.0 + this.columns : 0.0), 0.5, 1.0 + this.rows/2.0);
            this.scene.rotate((i ? -1.0 : 1.0) * Math.PI/2.0, 0.0, 0.0, 1.0);
            this.scene.scale(1.0, 1.0, this.rows);
            this.side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0.5, 0.5, 1.0 + (i ? this.rows : 0.0));
            this.scene.rotate((i ? 1.0 : -1.0) * Math.PI/2.0, 1.0, 0.0, 0.0);
            this.side.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.5 + this.columns, 0.5, 1.0 + (i ? this.rows : 0.0));
            this.scene.rotate((i ? 1.0 : -1.0) * Math.PI/2.0, 1.0, 0.0, 0.0);
            this.side.display();
            this.scene.popMatrix();
        }
        
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                let pos = i * this.columns + j;

                this.scene.pushMatrix();
                this.scene.translate(1 + j, 1.01, 1 + i);
                this.scene.registerForPick(pos + 1, this.tiles[pos]);
                this.dark_tiles[pos].display();
                this.scene.popMatrix();
                
            }
        }

        for(let i = 0; i < 2; i++){
            for(let j = 0; j < this.columns; j++){
                let aux_pos = i * this.columns + j;
                let pos = this.size + aux_pos;
~
                this.scene.pushMatrix();
                this.scene.translate(1.0 + j, 1.01, i * (1.0 + this.columns));
                this.scene.registerForPick(pos, this.tiles[pos]);
                this.light_tiles[aux_pos].display();
                this.scene.popMatrix();
            }
        }

        for(let i = 0; i < 2; i++){
            for(let j = 0; j < this.rows; j++){
                let aux_pos = 2 * this.columns + i * this.rows + j;
                let pos = this.size + aux_pos;
                
                this.scene.pushMatrix();
                this.scene.translate(i * (1.0 + this.rows), 1.01, 1.0 + j);
                this.scene.registerForPick(pos, this.tiles[pos]);
                this.light_tiles[aux_pos].display();
                this.scene.popMatrix();
            }
        }

        this.scene.popMatrix();
    }
}