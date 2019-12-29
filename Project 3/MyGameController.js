const states = Object.freeze({
    MENU: 1,
    CHOOSE_PIECE: 2,
    CHOOSE_FINAL: 3,
    MOVE: 4,
	PASS: 5,
	END: 6,
	UNDO: 7,
	MOVIE: 8,
	LOAD: 9,
});

const mode = Object.freeze({
    PvP: 1,
    PvB: 2,
    BvB: 3,
});

/**
 * Game Controller class 
 * 
 */
class MyGameController {
	constructor(scene) {
		this.scene = scene
		this.prologInterface = new MyPrologInterface(8081)
		this.theme = new MySceneGraph('board.xml', scene)
		this.gameSequence = new MyGameSequence()
		this.animator = new MyAnimator(scene, this, this.gameSequence)
 
		this.clock = new Clock(scene, 10, () => {this.playerTimeout()})

		this.numPasses = 0
		this.currState = states.MENU
		this.prevState = states.MENU
		this.gameMode = mode.PvP

		// TODO: mudar para classe
		this.players = ['player', 'player']
		this.currPlayer = 0

		this.initialPick = {column: 0, row: 0}
		this.dimensions = {columns: 4, rows: 4}

		this.promise = null;
		this.misClicks = 0

		this.possMoves = []
		this.moveSet = new Set()

		this.curr_time = 0

		this.currMove = null

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
		this.currState = states.CHOOSE_PIECE

		let this_promise = promise
		if(this_promise == null || this_promise == undefined){
			this.nextPlayer()
			this_promise = this.prologInterface.getPlayerMoves(this.board.board2NumberBoard(), this.currPlayer)
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
	}

	playerTimeout(){
		this.scene.setPickEnabled(false)
		console.log("End of turn: next player")
		this.highlightPossible(false)
		if (this.currState==states.CHOOSE_FINAL){
			let piece = this.board.getPiece(this.initialPick.column, this.initialPick.row)
			this.initialPick = {column:0 , row: 0}
			piece.toggle()
		}
		this.nextPlayerProc()
	}

	update(time){
		if(!this.curr_time){
			this.curr_time = time;
			return
		}

		let elapsed_time = time - this.curr_time
		this.curr_time = time

		this.animator.update(elapsed_time)
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

	async nextState(position){

		switch (this.currState) {
			case states.MENU:
				this.prevState = this.currState
				// TODO: mudar depois
				this.boardProlog = await this.prologInterface.initializeBoard(this.dimensions.rows, this.dimensions.columns)
				this.currState = states.LOAD
				
				// TODO: provisorio
				// -> Load
				this.nextState(null)
				break;
			case states.CHOOSE_PIECE:
				this.numPasses = 0
				this.prevState = this.currState
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
				this.moves = await this.prologInterface.movePlayer(this.board.board2NumberBoard(), this.currPlayer, [this.initialPick.column, this.initialPick.row, position[0], position[1]])
				this.currMove = new MyGameMove(this.board)
				this.currMove.addMoves(this.moves)
				this.gameSequence.addMove(this.currMove)
				this.nextState(null)

				break;
			case states.MOVE:

				this.prevState = this.currState

				this.nextPlayer()
				// TODO: passar isto para cima para ir calculando enquanto anima
				let promise = this.prologInterface.getPlayerMoves(this.board.board2NumberBoard(), this.currPlayer)
				// BUUUUUUUUUUUUUUG
				// Tem aqui aquele bug pois ele começa a calcular os movimentos com o board no estado anterior
				this.animator.start(new BasicAnimation(this.scene, 3), () => {this.nextPlayerProc(promise)})
				// this.nextPlayerProc(promise)
				break;
			case states.PASS:
				this.prevState = this.currState
				this.numPasses++
				if(this.numPasses == 2){
					this.currState = states.END
					this.nextState(null)
				}
				else
					this.nextPlayerProc()
				break;
			case states.END:
				this.clock.stop()
				console.log("Game End")
				let pBoard = this.board.board2NumberBoard()
				let points0 = await this.prologInterface.getPlayerPoints(pBoard, 0)
				let points1 = await this.prologInterface.getPlayerPoints(pBoard, 1)
				console.log("Result: " + points0 + " - "+ points1)
				
				break;
			case states.UNDO:
				break;
			case states.MOVIE:
				break;
			case states.LOAD:
				this.clock.pause()
				this.board.makeBoardSurface(this.boardProlog)
				if(this.prevState == states.MENU && this.players[0] == 'player'){
					this.possMoves = eval(await this.prologInterface.getPlayerMoves(this.board.board2NumberBoard(), 0))
					this.getInitialPos()
					this.currState = states.CHOOSE_PIECE
					this.clock.play()
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
		this.clock.display()
	}
	
}
