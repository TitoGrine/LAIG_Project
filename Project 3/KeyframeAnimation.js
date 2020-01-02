/**
 * KeyframeAnimation 
 * Animation class implementation. 
 * @constructor
 * 
 * @param {Reference to MyScene object} scene 
 * @param {KeyframeAnimation ID} id
 * @param {Array with the keyframes} keyframes 
 */
class KeyframeAnimation extends XMLAnimation {
	constructor(scene, id, keyframes) {
		super(scene, id);

		this.keyframes = keyframes;
		this.lastT = Date.now();
		this.keyframeID = 0;
		this.sumT = 0;
		this.deltaT = 0;

		this.actualKF = this.keyframes[this.keyframeID];
		this.nextKF = this.keyframes[this.keyframeID + 1];

		this.curMatrix = mat4.create();
	}

	/**
	 * Update Keyframes index
	 * Loop throught the keyframes until sumT is between to keyframes, and updates the keyframeID
	 */
	updateKeyFrames(){
		// Segment time is the difference between two keyframes
		let segmentTime = ((this.keyframes[this.keyframeID + 1].instant - this.keyframes[this.keyframeID].instant) * 1000);
		// While sumT is bigger than the segmentTime
		while(this.sumT > segmentTime){
			this.sumT -= segmentTime;
			// Updates keyframeID
			this.keyframeID++;

			// Tests if the animation reached the end
			if(this.keyframeID >= this.keyframes.length - 1)
				break;
			else
				segmentTime = ((this.keyframes[this.keyframeID + 1].instant - this.keyframes[this.keyframeID].instant) * 1000);
		}
	}

	/**
	 * Updates animation keyframes and calculates the new animation matrix (currMatrix)
	 * @param {Time when the function was called} time 
	 */
	update(time){
		// If the animation reached the end
		if(this.keyframeID >= this.keyframes.length - 1)
			return;
		
		// Updates deltaT and lastTime
		this.deltaT = time - this.lastT;
		this.lastT = time;
		
		// Update sumT and calculate new keyframeID
		this.sumT += this.deltaT;
		this.updateKeyFrames();
		// Updates actualKF and nextKF wiyh newly calculated keyframeID
		this.actualKF = this.keyframes[this.keyframeID];
		this.nextKF = this.keyframes[this.keyframeID + 1];
		
		// If the animation hasn't reached the end, calculates the interpolated matrix between the two keyframes
		if(this.nextKF !=  null){
			// Percentage of the time elapsed to the segment of time between the two keyframes
			let execPerc = this.sumT / ((this.nextKF.instant - this.actualKF.instant) * 1000);

			// Interpolate translate, rotate and scale values
			let interTranslate = this.interpolArray(this.nextKF.translate, this.actualKF.translate, execPerc);
			let interRotate = this.interpolArray(this.nextKF.rotate, this.actualKF.rotate, execPerc);
			let interScale = this.interpolArray(this.nextKF.scale, this.actualKF.scale, execPerc);
			
			// Calculate new matrix
			mat4.translate(this.curMatrix, mat4.create(), interTranslate);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[0], [1, 0, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[1], [0, 1, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[2], [0, 0, 1]);	
			mat4.scale(this.curMatrix, this.curMatrix, interScale);

		}
		// If animation reached the end calculates (only one time) the last matrix and saves it in currMatrix for later use
		else{
			mat4.translate(this.curMatrix, mat4.create(), this.keyframes[this.keyframeID].translate);
			mat4.rotate(this.curMatrix, this.curMatrix, this.keyframes[this.keyframeID].rotate[0], [1, 0, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, this.keyframes[this.keyframeID].rotate[1], [0, 1, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, this.keyframes[this.keyframeID].rotate[2], [0, 0, 1]);
			mat4.scale(this.curMatrix, this.curMatrix, this.keyframes[this.keyframeID].scale);	
		}	
	}

	/**
	 * Interpolates values of a transformation between two keyframes and returns new array
	 * 
	 * @param {Array with the values of the next keyframe transformation} next 
	 * @param {Array with the values of the current keyframe transformation} actual 
	 * @param {Percentage of the way that has already elapsed} percentagem 
	 * @returns Interpolate array
	 */
	interpolArray(next, actual, percentagem){
		let result = [];
		for(let i = 0;i < next.length; i++)
		  result.push((next[i] - actual[i]) * percentagem + actual[i]);
		return result;
	}

	/**
	 * Implementation of the apply abstract function
	 * Multiplies the animation Matrix
	 */
	apply(){
		this.scene.multMatrix(this.curMatrix);
	}
}
