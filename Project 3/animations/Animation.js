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

	/**
	 * Adds moves and toggles the pieces off
	 * 
	 * @param {All movements requiring an animation} moves 
	 */
	addMoves(moves){
		this.moves = moves;

		if(moves.length){
			moves[0][0].toggle_off();
		}
	}

	/**
	 * Returns Animation time
	 */
	getSpan() {
		return 0;
	}

	/**
	 * Update animation fuction
	 * @param {Elapsed time since the last update} time 
	 */
	update(elapsed_time){
	}

	/**
	 * Apply animation function.
	 */
	apply(){

		if(this.type == "player")
			this.moves[0][2].toggle_off();
	}
}
