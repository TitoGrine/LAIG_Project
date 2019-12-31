/**
 * Animation Abstract class to be implemented
 * @constructor
 * @param {Animation ID} id
 * 
 */
class Animation {
	constructor(scene) {
		this.scene = scene;
	}

	addMoves(moves){
		this.moves = moves;

		if(moves.length){
			moves[0][0].toggle_off();
		}
	}

	getSpan() {
		return 0;
	}

	/**
	 * Update animation fuction requires implementation
	 * @param {Current time when the function is called} time 
	 */
	update(elapsed_time){
	}

	/**
	 * Apply animation function requires implementation
	 */
	apply(){

		if(this.type == "player")
			this.moves[0][2].toggle_off();
	}
}
