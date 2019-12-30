/**
 * MyPlane
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Plane ID} id 
 * @param {Number of rows} rows 
 * @param {Number of columns} columns 
 */
class Board extends CGFobject {
	constructor(scene, id, x_dimensions, y_dimensions, geometry, color1, color2) {
        super(scene);
		this.id = id;

		
        this.rows = 0
		this.columns = 0
		this.size = 0

		this.x_dimensions = x_dimensions
		this.y_dimensions = y_dimensions
		
        this.x_scale = 0
        this.y_scale = 0

        this.geometry = geometry;
        this.color1 = color1;
        this.color2 = color2;

		this.highlight = false

		this.movement = [];

		this.boardInit = false
    }

    calculatePos([column, row]){
        return row * (this.columns + 2) + column;
    }

    /**
     * Creates the NURB surface corresponding to a plane centered in the XZ plane,
     * facing the +Y direction. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeBoardSurface(initialBoard){
		// this.board = [[3,1,0,1,0,3],[0,2,2,2,2,1],[1,2,2,2,2,0],[1,2,2,2,2,1],[0,2,2,2,2,1],[3,0,1,0,0,3]];
		this.board = initialBoard
		
        this.rows = this.board.length - 2;
		this.columns = this.board[0].length - 2;

		this.size = this.rows * this.columns;
        this.x_scale = this.x_dimensions / (this.columns + 2)
        this.y_scale = this.y_dimensions / (this.rows + 2)

		
        this.square = new MyPlane(this.scene, 'square', 30, 30);
        this.piece_holder = new MyPlane(this.scene, 'holder', 30, 30);
        this.side = new MyPlane(this.scene, 'side', 30, 30);
        this.tiles = [];
		let pos = 0
        for(let row = 0; row < this.rows + 2; row++){
            let aux_row = [];
            let row_state = this.board[row];

            for(let column = 0; column < this.columns + 2; column++){
                let state = row_state[column];
				let objects = [];

                if(state != 3){
                    objects.push(new Tile(this.scene, pos + 1, row, column, state == 2 ? [0.03, 0.6, 0.8] : [0.0, 0.8, 1.0], null));
                    if(state < 2){
						objects.push(new Piece(this.scene, pos + 1, state, row, column, this.geometry, state ? this.color2 : this.color1))
                        objects[0].addPiece(objects[1]);
                    }
				}
				pos++

                aux_row.push(objects);
            }

            this.tiles.push(aux_row);
		}
		this.boardInit = true
    }
	
	
    move(piece, init_tile, dest_tile){
		// TODO: ver depois
        let init_pos = init_tile.getCoords();
        let dest_pos = dest_tile.getCoords();

        this.tiles[init_pos[1]][init_pos[0]].pop();
        init_tile.remPiece();
        this.tiles[dest_pos[1]][dest_pos[0]].push(piece);
        dest_tile.addPiece(piece);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

	/**
	 * 	0 : player 0
	 *  1 : player 1
	 * 	2 : empty
	 * 	3 : corner
	 * 	4 : null
	 */
	// TODO: ver representação do board
	board2NumberBoard(){			
		let numberBoard = []
		for(let row = 0; row < this.rows + 2; row++){
			let numberRow = [] 
			for(let column = 0; column < this.columns + 2; column++){
                let objects = this.tiles[row][column];
                let state = objects.length;
				switch (state) {
					case 0:
						numberRow.push(3)
						break;
					case 1:
						if(row == 0 || row == this.rows + 1 || column == 0 || column == this.columns + 1)
							numberRow.push(4)
						else
							numberRow.push(2)					
						break;
					case 2:
						numberRow.push(objects[1].type)
						break;
				}
			}
			numberBoard.push(numberRow)
		}
		return numberBoard;
	}

	getTile(column, row){
		return this.tiles[row][column][0]
	}

	getPiece(column, row){
		return this.tiles[row][column][1]
	}

	setHighlight(value){
		this.highlight = value
	}

	isHighlighted(){
		return this.highlight
	}
	
    display(){
		if(!this.boardInit)
			return;

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
                // let pos = this.calculatePos([column, row]);
                let objects = this.tiles[row][column];
                let state = objects.length;

                if(state != 0){
                  //  this.scene.registerForPick(pos + 1, objects);
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