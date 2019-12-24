/**
 * MyPlane
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Plane ID} id 
 * @param {Number of rows} rows 
 * @param {Number of columns} columns 
 */
class Board extends CGFobject {
	constructor(scene, id, x_dimensions, y_dimensions, rows, columns, geometry, color1, color2) {
        super(scene);
		this.id = id;
        this.rows = rows;
        this.columns = columns;
        this.size = rows * columns;
        this.x_scale = x_dimensions / (columns + 2);
        this.y_scale = y_dimensions / (rows + 2);

        this.geometry = geometry;
        this.color1 = color1;
        this.color2 = color2;

        this.movement = [];

        
        this.makeBoardSurface();
    }

    calculatePos([column, row]){
        return row * (this.columns + 2) + column;
    }

    /**
     * Creates the NURB surface corresponding to a plane centered in the XZ plane,
     * facing the +Y direction. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeBoardSurface(){
        this.inicial_board = [[3,1,0,1,0,3],[0,2,2,2,2,1],[1,2,2,2,2,0],[1,2,2,2,2,1],[0,2,2,2,2,1],[3,0,1,0,0,3]];

        this.square = new MyPlane(this.scene, 'square', 30, 30);
        this.piece_holder = new MyPlane(this.scene, 'holder', 30, 30);
        this.side = new MyPlane(this.scene, 'side', 30, 30);
        this.tiles = [];

        for(let row = 0; row < this.rows + 2; row++){
            let aux_row = [];
            let row_state = this.inicial_board[row];

            for(let column = 0; column < this.columns + 2; column++){
                let state = row_state[column];
                let objects = [];

                if(state != 3){
                    objects.push(new Tile(this.scene, this.calculatePos([row, column]), row, column, state == 2 ? [0.03, 0.6, 0.8] : [0.0, 0.8, 1.0], null));
                    if(state != 2){
                        objects.push(new Piece(this.scene, this.calculatePos([row, column]), row, column, this.geometry, state ? this.color1 : this.color2));
                        objects[0].addPiece(objects[1]);
                    }
                }

                aux_row.push(objects);
            }

            this.tiles.push(aux_row);
        }
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                            var coords = obj[0].getCoords();
                            this.movement.push(obj[0]);
                            obj[0].toggle();
						    console.log("Picked object: " + obj + ", with coordenates " + coords);						
                        }
                    
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
	
	/*
    move(){
        if(this.movement.length != 2)
            return;

        let init_tile = this.movement[0];
        let dest_tile = this.movement[1];

        if(init_tile == dest_tile){
            this.movement = [];
            return;
        }

        let init_pos = init_tile.getCoords();
        let dest_pos = dest_tile.getCoords();

        let init_objects = this.tiles[init_pos[1]][init_pos[0]];
        let dest_objects = this.tiles[dest_pos[1]][dest_pos[0]];

        if(init_objects.length < 2){
            init_tile.toggle();
            dest_tile.toggle();
            this.movement = [];
            return;
        }

        let piece = init_objects.pop();
        init_tile.remPiece();
        dest_objects.push(piece);
        dest_tile.addPiece(piece);
    }*/

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }
    
    display(){

        this.scene.pushMatrix();

        this.scene.scale(this.x_scale, 1.0, this.y_scale);

        this.scene.pushMatrix();
        this.scene.translate(1 + this.columns/2.0, 1.0, 1 + this.rows/2.0);
        this.scene.scale(this.columns, 1.0, this.rows);
        this.square.display();
        this.scene.popMatrix();

        // this.move();
        
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

        this.scene.pushMatrix();
        this.scene.translate(0.0, 1.01, 0.0);
        for(let row = 0; row < this.rows + 2; row++){
            for(let column = 0; column < this.columns + 2; column++){
                let pos = this.calculatePos([column, row]);
                let objects = this.tiles[row][column];
                let state = objects.length;

                if(state != 0){
                    this.scene.registerForPick(pos + 1, objects);
                    objects[0].display();
                    if(state == 2)
                        objects[1].display();
                }
            }
		}
		
		// TODO: confirmar duas vezes
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}