/**
 * KeyframeAnimation
 * @constructor
 * @param {KeyframeAnimation ID} id
 * 
 */
class KeyframeAnimation extends Animation {
	constructor(scene, id, keyframes) {
		super(scene, id);

		this.keyframes = keyframes;
		this.lastT = Date.now();
		this.keyframeID = 0;
		this.sumT = 0;
		this.deltaT = 0;

		this.actualKF = this.keyframes[this.keyframeID];
		this.nextKF = this.keyframes[this.keyframeID + 1];

		this.prevMatrix = mat4.create();
		this.curMatrix = mat4.create();
	}

	update(time){
		if(this.keyframeID >= this.keyframes.length - 1)
			return;

		this.deltaT = time - this.lastT;
		this.lastT = time;

		this.sumT += this.deltaT;

		if(this.sumT > ((this.keyframes[this.keyframeID + 1].instant - this.keyframes[this.keyframeID].instant) * 1000)){

			this.sumT -= ((this.keyframes[this.keyframeID + 1].instant - this.keyframes[this.keyframeID].instant) * 1000);
			
			this.keyframeID++;

			this.actualKF = this.keyframes[this.keyframeID];
			this.nextKF = this.keyframes[this.keyframeID + 1];

			// Atualize matrix
			mat4.translate(this.prevMatrix, mat4.create(), this.keyframes[this.keyframeID].translate);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[0], [1, 0, 0]);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[1], [0, 1, 0]);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[2], [0, 0, 1]);
			//mat4.scale(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].scale);	
		}


		
		if(this.nextKF !=  null){
			let execPerc = this.sumT / ((this.nextKF.instant - this.actualKF.instant) * 1000);

			let interTranslate = this.interpolArray(this.nextKF.translate, this.actualKF.translate, execPerc, [0, 0, 0]);
			let interRotate = this.interpolArray(this.nextKF.rotate, this.actualKF.rotate, execPerc, [0, 0, 0]);
			let interScale = this.interpolArray(this.nextKF.scale, this.actualKF.scale, execPerc, this.actualKF.scale);
			
			mat4.translate(this.curMatrix, this.prevMatrix, interTranslate);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[0], [1, 0, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[1], [0, 1, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[2], [0, 0, 1]);	
			mat4.scale(this.curMatrix, this.curMatrix, interScale);

		}
		else{
			this.curMatrix = this.prevMatrix;
			mat4.scale(this.curMatrix, this.prevMatrix, this.keyframes[this.keyframeID].scale);	

		}	
	}

	interpolArray(next, actual, percentagem, constant){
		let result = [];
		for(let i = 0;i < next.length; i++)
		  result.push((next[i] - actual[i]) * percentagem + constant[i]);
		return result;
	}

	apply(){
		this.scene.multMatrix(this.curMatrix);
	}
}
