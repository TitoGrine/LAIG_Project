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
		let options = [	"   Scene  1   ", "   Scene  2   "]
		let actions = [() => this.gameController.changeTheme("scene.xml"), () => this.gameController.changeTheme("board.xml")]
		this.menu = new Menu(this.scene, 410, this.fontText, "  SCENE:  ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)
	}

	setSelectable(bool){
		this.menu.setSelectable(bool)
	}
	
	display(){
		if(this.gameController == null || this.gameController.currState == states.MENU && this.gameController.replaying)
			return
		this.menu.display()
	}
}
