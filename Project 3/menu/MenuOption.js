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
		this.selectable = true
	}

	pressed(){
		this.action()
	}

	setSelectable(bool){
		this.selectable = bool
	}

	display(){
		if(this.selectable)
			this.scene.registerForPick(this.id, this)
		
		super.display()
		
		if(this.selectable)
			this.scene.clearPickRegistration()
	}
}
