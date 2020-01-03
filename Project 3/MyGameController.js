const ON_CLOCK = true

const states = Object.freeze({
    MENU: 1,
    CHOOSE_PIECE: 2,
    CHOOSE_FINAL: 3,
    MOVE: 4,
	PASS: 5,
	END: 6,
	UNDO: 7,
	FILM: 8,
	LOAD: 9,
});

const mode = Object.freeze({
    PvP: 1,
	PvB: 2,
	BvP: 3,
    BvB: 4,
});

const fontSpecs = Object.freeze({
    x: -0.98,
	y: 0.98,
	height: 0.09,
	width: 0.045,
});

/**
 * Game Controller class 
 * 
 */
class MyGameController {
	constructor(scene) {
		this.scene = scene
		this.prologInterface = new MyPrologInterface(8081)
		this.theme = new MySceneGraph('vaporwave.xml', scene)
		this.gameSequence = new MyGameSequence()
		this.animator = new MyAnimator(scene, this, this.gameSequence)
	

		this.numPasses = 0
		this.currState = states.MENU
		this.prevState = states.MENU
		this.gameMode = mode.PvP

		// TODO: mudar para classe
		this.currPlayer = 0

		this.difficulty = [3, 4]

		this.initialPick = {column: 0, row: 0}
		this.dimensions = {columns: 4, rows: 4}

		this.promise = null;
		this.misClicks = 0
		this.pressedFKey = false;

		this.possMoves = []
		this.moveSet = new Set()

		this.curr_time = 0

		this.currMove = null
		this.replaying = false
	}

	init(){
		this.clock = new Clock(this.scene, 10, () => {this.playerTimeout()}, fontSpecs)
		this.score = new Score(this.scene, this.prologInterface, fontSpecs)

		this.setBoard()
		this.nextState(null)
	}
	setBoard(){
		// TODO: mudar
		this.board = this.theme.components['board'].component.children[0]
	}

	calculatePos([column, row]){
        return row * (this.columns + 2) + column;
    }

	managePick(mode, results){
		if (mode == false /* && some other game conditions */) {
			if (results != null && results.length > 0) {
				for (let i = 0; i < results.length; i++) {
                    let obj = results[i][0];
                    if (obj) {
						// let coords = obj[0].getCoords();
						// obj[0].toggle();
						// console.log("Picked object: " + obj + ", with coordenates " + coords);	
						// TODO: ver se mudar para ID
						let uniqueId = results[i][1] // get id
						this.onObjectSelected(obj, uniqueId);
						// this.onObjectSelected(obj, coords);
					
                    }
                    
				}
				results.splice(0, results.length);
			}
		}
	}

	onObjectSelected(obj, id) {
		if(obj instanceof Piece) {
			if(this.currState == states.CHOOSE_PIECE){
				if(this.moveSet.has(obj.getCoords()[0] + "-" + obj.getCoords()[1])){
					obj.toggle()
					this.nextState(obj.getCoords())
				}
				else{
					this.misClicks++
					if(this.misClicks == 3)
						this.nextState(-1)
				}
								
			}
			else if(this.currState == states.CHOOSE_FINAL){
				if(this.initialPick.column == obj.getCoords()[0] && this.initialPick.row == obj.getCoords()[1]){
					obj.toggle()
					this.nextState(obj.getCoords())
				}
				else if(this.moveSet.has(obj.getCoords()[0] + "-" + obj.getCoords()[1])){
					obj.tile.toggle()
					this.nextState(obj.getCoords())
				}
			}
			// do something with id knowing it is a piece

		} else if (obj instanceof Tile) {
			if(this.currState == states.CHOOSE_PIECE){
				if(this.moveSet.has(obj.getCoords()[0] + "-" + obj.getCoords()[1])){
					obj.piece.toggle()
					this.nextState(obj.getCoords())
				}
				else{
					this.misClicks++
					if(this.misClicks == 3)
						this.nextState(-1)
				}
			}
			else if(this.currState == states.CHOOSE_FINAL){
				if(this.moveSet.has(obj.getCoords()[0] + "-" + obj.getCoords()[1])){
					obj.toggle()
					this.nextState(obj.getCoords())
				}
			}
			// obj.toggle()
			// console.log("tile: " + obj.getCoords()[0] + ", " + obj.getCoords()[1])
			// do something with id knowing it is a tile
		} else {
			console.log(obj)
			obj()
			// error ? 
		}
	}

	// TODO: para já
	nextPlayer(){
		this.currPlayer = (this.currPlayer + 1) % 2
	}
	
	// // TODO: para já
	async nextPlayerProc(promise){
		await this.score.getPoints()
		if(this.players[this.currPlayer] == "player"){
			this.currState = states.CHOOSE_PIECE

			let this_promise = promise
			if(this_promise == null || this_promise == undefined || this_promise == "undo"){
				if(this_promise != "undo")
					this.nextPlayer()
				if(this.players[this.currPlayer] != "player"){
					this.prologInterface.moveBot(this.currPlayer, this.difficulty[this.currPlayer])
					this.nextPlayerProc()
					return
				}
				this_promise = this.prologInterface.getPlayerMoves(this.currPlayer)
			}

			this.possMoves = eval(await this_promise)
			this.scene.setPickEnabled(true)
			if(this.possMoves.length == 0){
				this.currState = states.PASS
				this.nextState(null)
			}
			else{
				this.getInitialPos()
				this.clock.restart()
			}
			return
		}

		this.currState = states.MOVE
		this.moves = await this.prologInterface.getBotMove()
		if(this.moves.length == 0){
			this.currState = states.PASS
			this.nextState(null)
		}
		else{
			this.currMove = new MyGameMove(this.board, this.moves, this.players[this.currPlayer])
			this.gameSequence.addMove(this.currMove)
			this.nextState(null)
		}
	}

	undo(){
		if(!this.gameSequence.isEmpty() && mode.BvB != this.gameMode){
			this.prevState = this.currState
			this.currState = states.UNDO
			this.nextState()
		}
	}

	playerTimeout(){
		this.scene.setPickEnabled(false)
		console.log("End of turn: next player")
		this.resetHighlights(false)
		this.nextPlayerProc()
	}

	resetHighlights(prev){
		this.highlightPossible(false)
		if ((prev ? this.prevState : this.currState)==states.CHOOSE_FINAL){
			let piece = this.board.getPiece(this.initialPick.column, this.initialPick.row)
			this.initialPick = {column:0 , row: 0}
			piece.toggle()
		}
	}

	startFilm(interrupt = false) {
		
		if(this.currState == states.MOVE || this.currState == states.FILM){
			return
		}
		
		this.clock.pause()
		this.replaying = true
		
		
		this.moveIndex = 0
		this.misClicks = 0
		this.board.resetBoard()
		this.highlightPossible(false)
		this.film_game_sequence = new MyGameSequence()
		
		this.alted_state = this.currState
		this.currState = states.FILM
		this.nextState(null)
	}
	
	endFilm() {
		console.log('Queue')
		this.replaying = false
		this.currState = this.alted_state
		this.film_game_sequence = null

		let promise
		if(this.players[this.currPlayer] == 'player')
			promise = this.prologInterface.getPlayerMoves(this.currPlayer)
		else
			this.prologInterface.moveBot(this.currPlayer, this.difficulty[this.currPlayer])

		this.nextPlayerProc(promise)
	}

	update(time){
		if(!this.curr_time){
			this.curr_time = time;
			return
		}

		let elapsed_time = time - this.curr_time
		this.curr_time = time

		this.animator.update(elapsed_time)
		if(this.scene.timer && ON_CLOCK)
			this.clock.update(elapsed_time)
	}

	highlightPossible(set){
		if(!set)
			for(let move of this.moveSet){
				let tile = this.board.getTile(parseInt(move[0]), parseInt(move[2]))
				tile.setHighlight(set)
			}
		else{
			this.moveSet.clear()
			let state = (set ? this.currState : this.prevState)
			for(let i = 0; i < this.possMoves.length; i++){
				let tile = null
				// TODO: otimizar e por break a seguir a encontrar o ultimo
				if(state == states.CHOOSE_FINAL && this.possMoves[i][0] == this.initialPick.column && this.possMoves[i][1] == this.initialPick.row)
					tile = this.board.getTile(this.possMoves[i][2], this.possMoves[i][3])
				else if(state == states.CHOOSE_PIECE)
					tile = this.board.getTile(this.possMoves[i][0], this.possMoves[i][1])
				
				if(tile != null) {
					tile.setHighlight(set)
					this.moveSet.add(tile.getCoords()[0] + "-" + tile.getCoords()[1])
				}
			}
		}
		this.board.setHighlight(set)
	}

	getInitialPos(){
		this.moveSet.clear()
		for(let i = 0; i < this.possMoves.length; i++){
			let tile = this.board.getTile(this.possMoves[i][0], this.possMoves[i][1])			
			this.moveSet.add(tile.getCoords()[0] + "-" + tile.getCoords()[1])
		}
	}

	gameMode2array(){
		switch (this.gameMode) {
			case mode.PvP:
				return ["player", "player"]
			case mode.PvB:
				return ["player", "bot"]
			case mode.BvP:
				return ["bot", "player"]
			case mode.BvB:
				return ["bot", "bot"]
		}
	}

	async nextState(position){

		switch (this.currState) {
			case states.MENU:
				this.prevState = this.currState
				// TODO: mudar depois
				await this.prologInterface.initializeBoard(this.dimensions.rows, this.dimensions.columns)
				this.currState = states.LOAD
				this.players = this.gameMode2array()
				
				// TODO: provisorio
				// -> Load
				this.nextState(null)
				break;
			case states.CHOOSE_PIECE:
				this.prevState = this.currState
				// TODO: ver isto, acho q desncessario
				if(this.promise != null){
					this.possMoves = eval(await this.promise);
					this.promise = null
					this.getInitialPos()
				}
				if(position < 0 && !this.board.isHighlighted()){
					this.highlightPossible(true)
					return
				}


				this.initialPick.column = position[0]
				this.initialPick.row = position[1]
				this.misClicks = 0
				this.highlightPossible(false)
				this.currState = states.CHOOSE_FINAL
				this.highlightPossible(true)

				break;
			case states.CHOOSE_FINAL:
				this.prevState = this.currState
				if(this.initialPick.column == position[0] && this.initialPick.row == position[1]){
					this.highlightPossible(false)
					// TODO: otimize with 2 different sets (??)
					this.getInitialPos()
					this.initialPick = {column:0 , row: 0}
					this.currState = states.CHOOSE_PIECE
					return
				}
				this.currState = states.MOVE
				this.clock.pause()
				// TODO: prov(??)
				this.highlightPossible(false)
				this.moves = await this.prologInterface.movePlayer(this.currPlayer, [this.initialPick.column, this.initialPick.row, position[0], position[1]])
				this.currMove = new MyGameMove(this.board, this.moves, this.players[this.currPlayer])
				this.gameSequence.addMove(this.currMove)
				this.nextState(null)
				break;
			case states.MOVE:
				this.numPasses = 0
				this.prevState = this.currState
				this.score.askForPoints()

				this.nextPlayer()
				let promise
				if(this.players[this.currPlayer] == 'player')
					promise = this.prologInterface.getPlayerMoves(this.currPlayer)
				else
					this.prologInterface.moveBot(this.currPlayer, this.difficulty[this.currPlayer])

				this.animator.start(this.gameSequence, this.board.getAnimation(), () => {this.nextPlayerProc(promise)})
				break;
			case states.PASS:
				this.prevState = this.currState
				this.numPasses++
				if(this.numPasses == 2){
					this.currState = states.END
					this.nextState(null)
				}
				else{
					if(this.players[this.currPlayer] != "player"){
						this.nextPlayer()
						if(this.players[this.currPlayer] == "player"){
							let promise = this.prologInterface.getPlayerMoves(this.currPlayer)
							this.nextPlayerProc(promise)
							return
						}
						this.prologInterface.moveBot(this.currPlayer, this.difficulty[this.currPlayer])
					}
					this.nextPlayerProc()
				}
				break;
			case states.END:
				this.clock.stop()
				console.log("Game End")
				// let points0 = await this.prologInterface.getPlayerPoints(0)
				// let points1 = await this.prologInterface.getPlayerPoints(1)
				// console.log("Result: " + points0 + " - "+ points1)
				
				break;
			case states.UNDO:
				this.scene.setPickEnabled(false)
				this.resetHighlights(true)
				let prevBoard = this.gameSequence.undo().getPrevBoard()
				this.prologInterface.setBoard(prevBoard)
				this.score.askForPoints()

				this.scene.setPickEnabled(true)
				if(this.gameMode == mode.PvP)
					this.nextPlayerProc()
				else if(!this.gameSequence.isEmpty() || this.gameMode == mode.PvB)
					this.nextPlayerProc("undo")
				else
					this.nextPlayerProc()
				break;
			case states.FILM:
				
				if(this.gameSequence.getNumberMoves() == this.moveIndex){
					this.endFilm()
					break
				}

				await new Promise(r => setTimeout(r, 500))

				// TODO: prov(??)
				this.highlightPossible(false)
				let move = this.gameSequence.getMove(this.moveIndex)
				console.log(move)
				this.film_game_sequence.addMove(move)

				this.animator.start(this.film_game_sequence, this.board.getAnimation(), () => {this.moveIndex++; this.nextState(null)})
				
				break;
			case states.LOAD:
				this.clock.pause()
				this.board.makeBoardSurface(this.prologInterface.getBoard())
				if(this.prevState == states.MENU){
					this.score.askForPoints()
					await this.score.getPoints()
					if(this.players[this.currPlayer] == 'player'){
						this.possMoves = eval(await this.prologInterface.getPlayerMoves(this.currPlayer))
						this.getInitialPos()
						this.currState = states.CHOOSE_PIECE
						this.clock.play()
					}
					else {
						this.currState = states.MOVE
						this.prologInterface.moveBot(this.currPlayer, this.difficulty[this.currPlayer])
						this.moves = await this.prologInterface.getBotMove()
						this.currMove = new MyGameMove(this.board, this.moves, this.players[this.currPlayer])
						this.gameSequence.addMove(this.currMove)
						this.nextState(null)
					}
					return
				}
				this.currState = this.prevState
				this.clock.play()
				break;
			default:
				break;
		}
	}

	display(){
		this.theme.displayScene()
		//this.board.display()
		this.animator.display()
		// this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
		
		
		if(!this.replaying){
			if(ON_CLOCK)
				this.clock.display()

			this.score.display()}
		// this.scene.gl.enable(this.scene.gl.DEPTH_TEST);

	}
	
}
