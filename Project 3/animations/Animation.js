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
		throw 'Animation: Implement apply function';
	}
}
