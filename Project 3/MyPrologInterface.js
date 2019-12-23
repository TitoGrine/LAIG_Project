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
		this.prevBoards;
		this.board;
		this.moves;
		this.hasMoves;
		this.points;
    }

    getPrologRequest(requestString, onSuccess, onError) {
		if(onSuccess == undefined)
			onSuccess = (data) => console.log("Request successful. Reply: " + data.target.response);
		if(onError == undefined)
			onError = () => console.log("Error waiting for response")
		let request = new XMLHttpRequest()
		request.open('GET', 'http://localhost:' + this.requestPort + '/' + requestString, true)
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

		request.addEventListener('load', onSuccess.bind(this))

		request.addEventListener('error', onError.bind(this))

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
		this.prevBoards = board;
		let strBoard =  JSON.stringify(board)
		let strMove =  JSON.stringify(move)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `movePlayer(${boardProlog},${player},${strMove})`;
		this.getPrologRequest(requestString, this.parseBoardHandler)
	}

	moveBot(board, player, difficulty) {
		this.prevBoards = board;
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
		let replyParsed = reply.replace(/wt|bl|empty|corner|null/g, this.prolog2js); 
		this.board = eval(replyParsed)
		console.log(this.board)
		this.boardDifferences(this.prevBoards, this.board)
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

	/**
	 * Calculates the column array of a bidimensional matrix
	 */
	arrayColumn = (arr, n) => arr.map(x => x[n]);

	/**
	 * Calculates the differences between the old board and the new board
	 * @param {Board before the move} prevBoard 
	 * @param {Board after the move} newBoard 
	 */
	boardDifferences(prevBoard, newBoard){
		let difCells = []
		// Search for 2 different cells to know the move directino
		for(let i = 0; i < prevBoard.length; i++)
			for(let j = 0; j < prevBoard[i].length; j++){
				if(prevBoard[i][j] != newBoard[i][j])
					difCells.push([i, j])
				if(difCells.length == 2)
					break;
			}

		let lineInfo = {}
		// Horizontal Case
		if(difCells[0][0] == difCells[1][0]){
			lineInfo.direction = 'H'
			lineInfo.newLine = newBoard[difCells[1][0]]
			lineInfo.oldLine = prevBoard[difCells[1][0]]
			lineInfo.index = difCells[1][0]
		}
		// Vertical Case
		else{
			lineInfo.direction = 'V'
			lineInfo.newLine = this.arrayColumn(newBoard, difCells[1][1])
			lineInfo.oldLine = this.arrayColumn(prevBoard, difCells[1][1])
			lineInfo.index = difCells[1][1]
		}
		// Caculates Line Differences
		let lineDiffs = this.lineDifferences(lineInfo.oldLine, lineInfo.newLine)

		this.moveAssembler(lineInfo, lineDiffs)
	}

	/**
	 * Calculates the differences between the 2 lines
	 * @param {Line/column before the move} oldLine 
	 * @param {Line/column after the move} newLine 
	 */
	lineDifferences(oldLine, newLine){
		let inverted = false;
		let length = oldLine.length - 1

		// Verifies if it has to be inverted (right to left or down to up)
		if(newLine[length] == 4 && oldLine[length] != 4){
			newLine.reverse()
			oldLine.reverse()
			inverted = true;
		}

		let lineDiffs = []
		let lastIndex = 0
		for(let i = 0; i < length; i++){
			let provIndex = 0
			// If found 0, go look for the next one after the last found object
			if(oldLine[i] == 0)
				provIndex = newLine.indexOf(0, i > lastIndex ? i : lastIndex)
			// If found 1, go look for the next one after the last found object
			else if(oldLine[i] == 1)
				provIndex = newLine.indexOf(1, i > lastIndex ? i : lastIndex)
			// If found smt & its starting position is different from the last, save it
			if(provIndex != 0 && provIndex != i){
				lineDiffs.push([i, provIndex])
				lastIndex = provIndex + 1
			}
		}

		/*
		for(let j = 0; j < lineDiffs.length; j++)
			if(lineDiffs[j][0] == lineDiffs[j][1]){
				lineDiffs.splice(j, 1)
				j--
			}
		*/
		// If the line was inverted, calculcate correct indexes
		if(inverted)
			for(let j = 0; j < lineDiffs.length; j++)
				lineDiffs[j] = [length - lineDiffs[j][0], length - lineDiffs[j][1]]

		return lineDiffs;
	}

	/**
	 * Assembles the movement
	 * @param {Struct with the line Info} lineInfo 
	 * @param {Array with the push movement} lineDiffs 
	 */
	moveAssembler(lineInfo, lineDiffs){
		let moves = []
		for(let i = 0; i < lineDiffs.length; i++){
			if(lineInfo.direction == 'V')
				moves.push([lineInfo.index, lineDiffs[i][0], lineInfo.index, lineDiffs[i][1]])
			else
				moves.push([lineDiffs[i][0], lineInfo.index, lineDiffs[i][1], lineInfo.index])
		}
		this.moves = moves;
	}
}