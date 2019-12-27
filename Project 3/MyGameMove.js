/**
 * Game Move class 
 * 
 */
class MyGameMove {
	constructor(board) {
		// TODO: depois isto n vai ser assim tão simples de dar pop pq vai ser alterado
		this.board = board
	}

	addMoves(moves){
		this.prologBoard = this.board.board2NumberBoard()
		this.moves = []
		// TODO: ver se separado para controlar animações ou feito por submobvimentos (como está)
		for(let i = 0; i < moves.length; i++)
			this.moves.push(new MyBasicMove(this.board, this.board.getPiece(moves[i][0], moves[i][1]), this.board.getTile(moves[i][0], moves[i][1]), this.board.getTile(moves[i][2], moves[i][3])))
	}

	animate(){
		console.log('TODO: moving')
		for(let i = this.moves.length - 1; i >= 0; i--)
			this.moves[i].animate()
	}
}
