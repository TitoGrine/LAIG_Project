/**
* MyPrologInterface class
*/

/**
 * 	0 : player 0
 *  1 : player 1
 * 	2 : empty
 * 	3 : corner
 * 	4 : null
 */
class MyPrologInterface {
    /**
     * @constructor
     */
    constructor(port) {
		this.requestPort = port || 8081
		this.board;
		this.moves;
		this.hasMoves;
		this.points;
    }

    getPrologRequest(requestString, onSuccess, onError) {
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
		
		this.getPrologRequest(requestString, this.parseBoardHandler)
	}

	getPlayerPoints(board, player) {
		let strBoard =  JSON.stringify(board)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `points(${boardProlog},${player})`;
		this.getPrologRequest(requestString, this.parseReply)
	}
	
	hasValidMoves(board, player) {
		let strBoard =  JSON.stringify(board)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `hasMovesLeft(${boardProlog},${player})`;
		this.getPrologRequest(requestString, this.parseReply)
	}

	getPlayerMoves(board, player) {
		let strBoard =  JSON.stringify(board)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `playerMoves(${boardProlog},${player})`;
		this.getPrologRequest(requestString, this.parseReply)
	}

	movePlayer(board, player, move) {
		let strBoard =  JSON.stringify(board)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `movePlayer(${boardProlog},${player},${move})`;
		this.getPrologRequest(requestString, this.parseBoardHandler)
	}

	moveBot(board, player, difficulty) {
		let strBoard =  JSON.stringify(board)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `moveBot(${boardProlog},${player},${difficulty})`;
		this.getPrologRequest(requestString, this.parseBoardHandler)
	}

	quit() {
		this.getPrologRequest('quit')
	}

	/**
	 * Handlers
	 */
	parseBoardHandler(data){
		let reply = data.target.response
		// TODO: ver pq é q função n é reconhecida
		let replyParsed = reply.replace(/wt|bl|empty|corner|null/g, function(x) {
				switch (x) {
					case 'wt':
						return '0';
					case 'bl':
						return '1';
					case 'empty':
						return '2';
					case 'corner':
						return '3';
					case 'null':
						return '4';
				}
				return x;
		}); 
		this.board = eval(replyParsed)
		console.log(this.board)
	}

	parseReply(data){
		let reply = eval(data.target.response)
		if(Array.isArray(reply))
			this.moves = reply
		else if(typeof reply === 'boolean')
			this.hasMoves = reply
		else
			this.points = reply
	}
		
	getBoard(){
		return this.board
	}

	getMoveList(){
		return this.moves
	}

	getHasMoves(){
		return this.hasMoves
	}

	getPoints(){
		return this.points
	}

	js2prolog (x) {
		switch (x) {
			case '0':
				return 'wt';
			case '1':
				return 'bl';
			case '2':
				return 'empty';
			case '3':
				return 'corner';
			case '4':
				return 'null';
		}
		return x;
	}

	prolog2js(x) {
		console.log(x)
		switch (x) {
			case 'wt':
				return 0;
			case 'bl':
				return 1;
			case 'empty':
				return 2;
			case 'corner':
				return 3;
			case 'null':
				return 4;
		}
		return x;
	}
}