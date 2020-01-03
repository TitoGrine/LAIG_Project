/**
 * Label class 
 * @constructor
 * 
 */
class Label extends MenuOption{
	constructor(scene, id, string, font, x, y, width, height, action, background, foreground) {
		super(scene, id, string, font, x, y, width, height, action, background, foreground)

		this.gameController = null
		this.type = null
	}

	setGameController(type, gameController){
		this.gameController = gameController
		this.type = type
	}

	display(){
		if(this.gameController == null || this.gameController.currState == states.MENU || this.gameController.replaying)
			return
			
		if(this.selectable)
			this.scene.registerForPick(this.id, this)
		
		switch (this.type) {
			case button.undo:
				if(this.gameController.gameMode != mode.BvB && this.gameController.currState != states.END)
					super.display()
				break;
			case button.replay:
				if(this.gameController.gameMode != mode.BvB)
					super.display()
				break;
			case button.restart:
				super.display()
				break;
		}		

		if(this.selectable)
			this.scene.clearPickRegistration()
	}
}
