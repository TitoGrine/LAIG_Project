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
		this.points;
    }

    async getPrologRequest(requestString) {	
		self = this;
		return new Promise(function (resolve, reject) {
			let request = new XMLHttpRequest()
			request.open('GET', 'http://localhost:' + self.requestPort + '/' + requestString, true)
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

			request.addEventListener('load', function(data){
				console.log(requestString + ": " + data.target.response)
				resolve(data.target.response)
			})
			
			// TODO: ver isto depois
			request.addEventListener('error', function(data){
				console.log("Error waiting for response (" + requestString + ")");
				reject(data.target.response);
			})
			request.send();
		});
	}

	/**
	 * Requests
	 */

	async initializeBoard(rows, columns) {
		let requestString = `init_board(${rows},${columns})`;
		let reply  = await this.getPrologRequest(requestString)
		this.newBoard = this.parseBoardHandler(reply)
	}
	
	getPlayerPoints(player) {
		let strBoard =  JSON.stringify(this.newBoard)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `points(${boardProlog},${player})`;
		return this.getPrologRequest(requestString)
	}

	// hasValidMoves(board, player) {
	// 	let strBoard =  JSON.stringify(board)
	// 	let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
	// 	let requestString = `hasMovesLeft(${boardProlog},${player})`;
	// 	this.getPrologRequest(requestString, this.parseReply)
	// }

	getPlayerMoves(player) {
		let strBoard =  JSON.stringify(this.newBoard)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `playerMoves(${boardProlog},${player})`;
		return this.getPrologRequest(requestString)
	}

	async movePlayer(player, move) {
		let prev = this.newBoard
		let strBoard =  JSON.stringify(this.newBoard)
		let strMove =  JSON.stringify(move)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `movePlayer(${boardProlog},${player},${strMove})`;
		let reply = await this.getPrologRequest(requestString)
		this.newBoard = this.parseBoardHandler(reply)
		return this.boardDifferences(prev, this.newBoard)
	}

	moveBot(player, difficulty) {
		let strBoard =  JSON.stringify(this.newBoard)
		let boardProlog = strBoard.replace(/0|1|2|3|4/g, this.js2prolog);
		let requestString = `moveBot(${boardProlog},${player},${difficulty})`;
		this.botPromise = this.getPrologRequest(requestString)
	}

	async getBotMove(){
		let prev = this.newBoard
		let reply = await this.botPromise
		if("false" == reply)
			return []
		this.newBoard = this.parseBoardHandler(reply)
		return this.boardDifferences(prev, this.newBoard)
	}

	quit() {
		this.getPrologRequest('quit')
	}

	/**
	 * Handlers
	 */
	parseBoardHandler(reply){
		let replyParsed = reply.replace(/wt|bl|empty|corner|null/g, this.prolog2js); 
		return eval(replyParsed)
	}

	getBoard(){
		return this.newBoard
	}

	setBoard(board){
		this.newBoard = board
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

		return this.moveAssembler(lineInfo, lineDiffs)
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
		if(inverted){
			for(let j = 0; j < lineDiffs.length; j++)
				lineDiffs[j] = [length - lineDiffs[j][0], length - lineDiffs[j][1]]
			newLine.reverse()
			oldLine.reverse()
		}

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
		return moves;
	}
}