/**
 * Animation Abstract class to be implemented
 * @constructor
 * @param {Animation ID} id
 * 
 */
class Animation {
	constructor(scene, id) {
		this.scene = scene;

		this.id = id;
	}

	/**
	 * Update animation fuction requires implementation
	 * @param {Current time when the function is called} time 
	 */
	update(time){
		throw 'Animation: Implement update(time) function';
	}

	/**
	 * Apply animation function requires implementation
	 */
	apply(){
		throw 'Animation: Implement apply function';
	}
}
