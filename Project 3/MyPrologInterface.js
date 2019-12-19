/**
* MyPrologInterface class
*/
class MyPrologInterface {
    /**
     * @constructor
     */
    constructor(port) {
        this.requestPort = port || 8081
    }

    getPrologRequest(requestString, onSuccess, onError) {
		console.log('ola')
		let request = new XMLHttpRequest()
		request.open('GET', 'http://localhost:' + this.requestPort + '/' + requestString, true)
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

		request.addEventListener('load', onSuccess || function(data){
			console.log("Request successful. Reply: " + data.target.response)
		})

		request.addEventListener('error', onError || function(){
			console.log("Error waiting for response")
		})

		request.send()
	}

	/**
	 * Requests
	 */

	initializeBoard(rows, columns) {
		let requestString = `init_board(${rows},${columns})`;
		
		this.getPrologRequest(requestString)
	}

	getPlayerPoints(board, player) {
		let requestString = `points(${board},${player})`;
		this.getPrologRequest(requestString)
	}
	
	hasValidMoves(board, player) {
		let requestString = `hasMovesLeft(${board},${player})`;
		this.getPrologRequest(requestString)
	}

	getPlayerMoves(board, player) {
		let requestString = `playerMoves(${board},${player})`;
		this.getPrologRequest(requestString)
	}

	movePlayer(board, player, move) {
		let requestString = `movePlayer(${board},${player},${move})`;
		this.getPrologRequest(requestString)
	}

	moveBot(board, player, difficulty) {
		let requestString = `moveBot(${board},${player},${difficulty})`;
		this.getPrologRequest(requestString)
	}

	quit() {
		this.getPrologRequest('quit')
	}

	/**
	 * Handlers
	 */
	//Handle the Reply
	handleReply(data){
		document.querySelector("#query_result").innerHTML=data.target.response;
	}
		
}