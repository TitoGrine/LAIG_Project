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

	getLastMove(){
		return this.gameMoves.slice(-1).pop();
	}

	undo(){
		return this.gameMoves.pop()
	}

	// TODO: Replay

}
