/**
 * Game Sequence class 
 * 
 */
class MyGameSequence {
	constructor() {
		this.gameMoves = []
	}

	addMove(move){
		this.gameMoves.push(move)
	}

	getMove(moveIndex){
		if(moveIndex >= 0 && moveIndex < this.gameMoves.length)
			return this.gameMoves[moveIndex]
		else
			return null
	}

	getLastMove(){
		return this.gameMoves.slice(-1).pop()
	}

	getNumberMoves(){
		return this.gameMoves.length
	}

	undo(){
		let move = null
		do {
			move = this.gameMoves.pop()
			let moves = move.getMoves()
			for(let i = 0; i <  moves.length; i++)
				move.getBoard().move(moves[i][0], moves[i][2], moves[i][1]);
			
			if(this.isEmpty())
				break;
		} while (move.getType() != "player");

		return move
	}

	isEmpty(){
		return this.gameMoves.length == 0
	}

	restart(){
		this.gameMoves = []
	}

	// TODO: Replay

}
