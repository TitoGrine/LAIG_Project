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
	constructor(scene, time, listener, font) {
		super(scene)

		this.initialTime = time;
		this.currTimeMs = time * 1000
		this.state = clock_states.STOP
		this.listener = listener

		this.x = font.x
		this.y = font.y
		this.height = font.height
		this.width = font.width

		this.font = new MyFont(scene, "TIMER: ", font.texture,this.x, this.y - 2 * this.height, this.width, this.height, true)

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
		if(this.initialTime < 0)
			return
		if(this.state == clock_states.PLAY){
			this.currTimeMs  -= time
			if(this.currTimeMs <= 0){
				this.state = clock_states.END
				// TODO: fazer alguma coisa
				this.listener()
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
		if(this.initialTime < 0)
			return
		// TODO: fazer
		this.scene.pushMatrix()
		this.scene.translate(0, -2, 0)
		this.font.setString("TIMER: " + this.getCurrTime())
		this.font.display()
		this.scene.popMatrix()

		// console.log("Curr Time: " + this.getCurrTime())
	}
}
