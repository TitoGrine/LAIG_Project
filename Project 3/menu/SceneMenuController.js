/**
 * SceneMenuController class 
 * @constructor
 * 
 */
class SceneMenuController extends MenuController{
	constructor(scene, font, options_bg, options_fg, title_bg, title_fg) {
		super(scene, font, options_bg, options_fg, title_bg, title_fg)

		this.menu = null
	}

	buildMenus(){
		let options = [" 1)  Gallery  ", " 2) Vaporwave "]
		let actions = [() => this.gameController.changeTheme("gallery.xml"), () => this.gameController.changeTheme("vaporwave.xml")]
		this.menu = new Menu(this.scene, 450, this.fontText, "  SCENE:  ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)
	}

	setSelectable(bool){
		this.menu.setSelectable(bool)
	}
	
	display(){
		if(this.gameController == null || this.gameController.currState == states.MENU || this.gameController.replaying)
			return
		this.menu.display()
	}
}
