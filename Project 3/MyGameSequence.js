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

	undo(){
		return this.gameMoves.pop()
	}

	// TODO: Replay

}
