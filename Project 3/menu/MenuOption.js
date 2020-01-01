/**
 * MenuOption class 
 * @constructor
 * 
 */
class MenuOption extends MyFont{
	constructor(scene, id, string, font, x, y, width, height, action, background, foreground) {
		super(scene, string, font, x, y, width, height, false, background, foreground)

		this.action = action
		this.id = id
	}

	pressed(){
		this.action()
	}


	display(){
		this.scene.registerForPick(this.id, this)
		
		super.display()
		
		this.scene.clearPickRegistration()

	}
}
