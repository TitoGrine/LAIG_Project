/**
 * Game Move class 
 * 
 */
class MyGameMove {
	constructor(board, moves, type) {
		this.type = type
		this.board = board
		this.prologBoard = this.board.board2NumberBoard()
		this.moves = []
		// TODO: ver se separado para controlar animações ou feito por submobvimentos (como está)
		for(let i = 0; i < moves.length; i++)
			this.moves.push([this.board.getPiece(moves[i][0], moves[i][1]), this.board.getTile(moves[i][0], moves[i][1]), this.board.getTile(moves[i][2], moves[i][3])])
	}

	getMoves(){
		return this.moves
	}

	getType(){
		return this.type
	}

	getPrevBoard(){
		return this.prologBoard
	}

	getBoard(){
		return this.board
	}

	animate(){
		//console.log('TODO: moving')
		//for(let i = this.moves.length - 1; i >= 0; i--)
		//	this.moves[i].animate()
	}
}
