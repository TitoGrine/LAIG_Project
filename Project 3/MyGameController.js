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
		this.prologInterface = new MyPrologInterface(8081)
		this.theme = new MySceneGraph('board.xml', scene)
		this.gameSequence = new MyGameSequence()
		//this.animator = new MyAnimator()
 

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

	update(time){
		//this.animator.update(time)
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

				// TODO: prov(??)
				this.highlightPossible(false)
				this.moves = await this.prologInterface.movePlayer(this.board.board2NumberBoard(), this.currPlayer, [this.initialPick.column, this.initialPick.row, position[0], position[1]])
				this.currMove = new MyGameMove(this.board)
				this.currMove.addMoves(this.moves)
				this.gameSequence.addMove(this.currMove)
				this.nextState(null)
				break;
			case states.MOVE:
				// TODO: nextPlayer
				this.currPlayer = (this.currPlayer + 1) % 2
				let promise = this.prologInterface.getPlayerMoves(this.board.board2NumberBoard(), this.currPlayer)
					
				// TODO: Animate
				this.prevState = this.currState
				let piece = this.board.getPiece(this.initialPick.column, this.initialPick.row)
				piece.toggle()
				this.currMove.animate()
				piece.tile.toggle()
				this.currState = states.CHOOSE_PIECE

				this.possMoves = eval(await promise)
				this.getInitialPos()
				break;
			case states.PASS:
				break;
			case states.END:
				break;
			case states.UNDO:
				break;
			case states.MOVIE:
				break;
			case states.LOAD:
				this.board.makeBoardSurface(this.boardProlog)
				if(this.prevState == states.MENU && this.players[0] == 'player'){
					this.possMoves = eval(await this.prologInterface.getPlayerMoves(this.board.board2NumberBoard(), 0))
					this.getInitialPos()
					this.currState = states.CHOOSE_PIECE
					return
				}
				this.currState = this.prevState
				break;
			default:
				break;
		}
	}

	display(){
		this.theme.displayScene()
		//this.board.display()
		//this.animator.display()
	}
	
}
