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

			// Atualize matrix
			mat4.translate(this.prevMatrix, mat4.create(), this.keyframes[this.keyframeID].translate);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[0], [1, 0, 0]);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[1], [0, 1, 0]);
			mat4.rotate(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].rotate[2], [0, 0, 1]);
			mat4.scale(this.prevMatrix, this.prevMatrix, this.keyframes[this.keyframeID].scale);	
		}


		var actualKF = this.keyframes[this.keyframeID];
		var nextKF = this.keyframes[this.keyframeID + 1];
		if(nextKF !=  null){
			var execPerc = this.sumT / ((nextKF.instant - actualKF.instant) * 1000);

			var interTranslate = this.interpolArray(nextKF.translate, actualKF.translate, execPerc, 0);
			var interRotate = this.interpolArray(nextKF.rotate, actualKF.rotate, execPerc, 0);
			var interScale = this.interpolArray(nextKF.scale, actualKF.scale, execPerc, 1);
			
			mat4.translate(this.curMatrix, this.prevMatrix, interTranslate);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[0], [1, 0, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[1], [0, 1, 0]);
			mat4.rotate(this.curMatrix, this.curMatrix, interRotate[2], [0, 0, 1]);	
			mat4.scale(this.curMatrix, this.curMatrix, interScale);

		}
		else
			this.curMatrix = this.prevMatrix;		
	}

	interpolArray(array1, array2, percentagem, constant){
		var result = [];
		for(var i = 0;i < array1.length; i++)
		  result.push((array1[i] - array2[i]) * percentagem + constant);
		return result;
	}

	apply(){
		this.scene.multMatrix(this.curMatrix);
	}
}
