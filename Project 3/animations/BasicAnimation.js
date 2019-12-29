let identity = mat4.create();
mat4.identity(identity);

/**
 * Animation Abstract class to be implemented
 * @constructor
 * @param {Animation ID} id
 * 
 */
class BasicAnimation extends Animation{
	constructor(scene, span = 1.0) {
        super(scene);
        this.scene = scene;
        this.span = span;

        this.translations = [];

    }

    createAnimationMatrix(){

        for(let i = 0; i < this.pieces.length; i++){
            let init_coords = this.init_tiles[i].getCoords();            
            let dest_coords = this.dest_tiles[i].getCoords();
            
            let delta_x = dest_coords[0] - init_coords[0];
            let delta_z = dest_coords[1] - init_coords[1];

            this.translations.push([delta_x, Math.PI, delta_z]);
        }
    }
    
    addMoves(moves){
        super.addMoves(moves);
        
        this.pieces = [];
        this.init_tiles = [];
        this.dest_tiles = [];

        for(let i = 0; i < moves.length; i++){
            this.pieces.push(moves[i][0]);
            this.init_tiles.push(moves[i][1]);
            this.dest_tiles.push(moves[i][2]);
        }

        this.createAnimationMatrix();
	}

	/**
	 * Update animation fuction requires implementation
	 * @param {Current time when the function is called} time 
	 */
	update(elapsed_time){
        // super.update(elapsed_time);
        
        let delta = elapsed_time / (this.span * 1000);


        this.updateAnimations(delta);
    }

    updateAnimations(delta){

        for(let i = 0; i < this.pieces.length; i++){
            let animation_translation = [this.translations[i][0] * delta, Math.sin(this.translations[i][1] * delta), this.translations[i][2] * delta];
            let animation_matrix = mat4.create();
            mat4.translate(animation_matrix, animation_matrix, animation_translation);

            // console.log(animation_matrix)

            this.pieces[i].updateAnimation(animation_matrix);
        }
    }

    displayPieces(){
        for(let i = 0; i < this.pieces.length; i++){
            this.pieces[i].display();
        }
    }
    
    getSpan() {
        return this.span;
    }

	/**
	 * Apply animation function requires implementation
	 */
	apply(board){

        for(let i = this.pieces.length - 1; i >= 0; i--){
            this.pieces[i].updateAnimation(identity);
            board.move(this.pieces[i], this.init_tiles[i], this.dest_tiles[i]);
        }

        this.pieces[0].tile.toggle();
        
	}
}