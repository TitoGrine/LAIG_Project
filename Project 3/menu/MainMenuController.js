/**
 * MainMenuController class 
 * @constructor
 * 
 */
class MainMenuController extends MenuController{
	constructor(scene, font, options_bg, options_fg, title_bg, title_fg) {
		super(scene, font, options_bg, options_fg, title_bg, title_fg)

		this.actualMenu = null
		this.curr = 0
	}

	buildMenus(){
		let options = ["     mode     ", "     time     ", "  board size  ", " choose scene ", "    <PLAY>    "]
		let actions = [() => this.actualMenu = this.modeMenu, () => this.actualMenu = this.timeMenu, () => this.actualMenu = this.sizeMenu, () => this.actualMenu = this.sceneMenu, () => this.play()]
		this.mainMenu = new Menu(this.scene, 300, this.fontText, "   FUSE   ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		options = [	"    10 sec    ", "    30 sec    ", "    60 sec    ", "   no timer   ", "    <BACK>    "]
		actions = [() => this.setTime(10), () => this.setTime(30), () =>  this.setTime(60), () => this.setTime(-1), () => this.actualMenu = this.mainMenu]
		this.timeMenu = new Menu(this.scene, 310, this.fontText, "   TIME   ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		options = [	"     Small    ", "    Medium    ", "     Large    ", "    <BACK>    "]
		actions = [() => this.setDimensions(3,3), () => this.setDimensions(4,4), () =>  this.setDimensions(6,6), () => this.actualMenu = this.mainMenu]
		this.sizeMenu = new Menu(this.scene, 320, this.fontText, "   SIZE   ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		// TODO: fazer este
		options = [	"   Scene  1   ", "   Scene  2   ", "    <BACK>    "]
		actions = [() => this.setTheme("scene.xml"), () => this.setTheme("board.xml"), () => this.actualMenu = this.mainMenu]
		this.sceneMenu = new Menu(this.scene, 330, this.fontText, "  SCENE:  ", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		options = [	"Human vs Human", "Human vs  Bot ", " Bot  vs Human", " Bot  vs  Bot ", "    <BACK>    "]
		actions = [() => this.setGameMode(1), () => this.setGameMode(2), () =>  this.setGameMode(3), () =>  this.setGameMode(4), () => this.actualMenu = this.mainMenu]
		this.modeMenu = new Menu(this.scene, 340, this.fontText, "GAME  MODE", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		options = [	"  Very  Easy  ","     Easy     ","    Normal    ","     Hard     ","  Very  Hard  ","    <BACK>    "]
		actions = [() => this.setDifficulty(0), () => this.setDifficulty(1), () => this.setDifficulty(2), () => this.setDifficulty(3), () => this.setDifficulty(4), () => this.actualMenu = this.modeMenu]
		this.diffMenu = new Menu(this.scene, 350, this.fontText, "DIFFICULTY", options, actions, this.options_bg, this.options_fg, this.title_bg, this.title_fg)

		this.actualMenu = this.mainMenu
	}

	play(){
		if(this.gameController.gameMode == 4)
			this.gameController.clock.setInitialTime(-1)
		this.gameController.currState = states.LOAD
		this.gameController.nextState(null)
	}

	setGameMode(option){
		this.curr = 0
		this.gameController.gameMode = option
		if(option == 4){
			this.diffMenu.setTitle("BOT 0 DIFF")
			this.actualMenu = this.diffMenu
		}
		else if(option > 1){
			this.diffMenu.setTitle("BOT   DIFF")
			this.actualMenu = this.diffMenu
		}
		else
			this.actualMenu = this.mainMenu
		this.gameController.gameMode2array()
	}

	setTime(time){
		this.gameController.clock.setInitialTime(time)
		this.actualMenu = this.mainMenu
	}

	setTheme(theme){
		this.gameController.theme = new MySceneGraph(theme, this.scene)
	}

	async setDimensions(columns, rows){
		// TODO: ver se é mesmo preciso
		this.gameController.dimensions = {columns: columns, rows: rows}
		this.actualMenu = this.mainMenu
		await this.gameController.prologInterface.initializeBoard(rows, columns)
	}

	setDifficulty(diff){
		switch (this.gameController.gameMode) {
			case mode.PvB:
				this.gameController.difficulty[1] = diff
				this.actualMenu = this.mainMenu
				break;
			case mode.BvP:
				this.gameController.difficulty[0] = diff
				this.actualMenu = this.mainMenu
				break;
			case mode.BvB:
				this.gameController.difficulty[this.curr] = diff
				this.curr++
				if(this.curr > 1){
					this.actualMenu = this.mainMenu
					return
				}
				this.diffMenu.setTitle("BOT 1 DIFF")
			default:
				break;
		}
	}
	
	display(){
		if(this.gameController == null || this.gameController.currState != states.MENU)
			return

		this.actualMenu.display()
	}
}
