/**
 * MenuController class 
 * @constructor
 * 
 */
class MenuController extends CGFobject {
	constructor(scene, font, options_bg, options_fg, title_bg, title_fg) {
		super(scene)
		this.gameController = null

		this.fontText = font

		this.options_bg = options_bg
		this.options_fg = options_fg
		this.title_bg = title_bg
		this.title_fg = title_fg
	}

	setGameController(gameController){
		this.gameController = gameController
		this.buildMenus()
	}

	buildMenus(){}
	
	updateTexCoords(lengthS, lengthT){

	}
	
	display(){}
}
