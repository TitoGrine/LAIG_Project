/**
 * Game Move class 
 * 
 */
class MyBasicMove extends MyGameMove {
	constructor(board, piece, initial, final) {
		// TODO: esta sujo
		super(board)

		this.piece = piece
		this.initial = initial
		this.final = final
	}

	animate(){
		console.log('TODO: moving basic')
		this.board.move(this.piece, this.initial, this.final)
	}
}
