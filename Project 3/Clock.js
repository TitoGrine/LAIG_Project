const clock_states = Object.freeze({
    PLAY: 1,
    PAUSE: 2,
	STOP: 3,
	END: 4,
});

/**
 * Clock class 
 * @constructor
 * 
 */
class Clock extends CGFobject{
	constructor(scene, time, callback) {
		super(scene)

		this.initialTime = time;
		this.currTimeMs = time * 1000
		this.state = clock_states.STOP
		this.callback = callback
	}

	getCurrTime(){
		return Math.ceil(this.currTimeMs / 1000);
	}

	setInitialTime(time){
		this.initialTime = time
	}

	restart(){
		this.currTimeMs = this.initialTime * 1000
		this.state = clock_states.PLAY
	}

	update(time){
		if(this.state == clock_states.PLAY){
			this.currTimeMs  -= time
			if(this.currTimeMs <= 0){
				this.state = clock_states.END
				// TODO: fazer alguma coisa
				this.callback()
			}

		}
	}

	pause(){
		this.state = clock_states.PAUSE
	}

	play(){
		this.state = clock_states.PLAY
	}

	stop(){
		this.state = clock_states.STOP
		this.time = 0
	}

	updateTexCoords(lengthS, lengthT){

	}
	
	display(){
		// TODO: fazer
		console.log("Curr Time: " + this.getCurrTime())
	}
}
