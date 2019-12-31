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
		return this.gameMoves.pop()
	}

	// TODO: Replay

}
