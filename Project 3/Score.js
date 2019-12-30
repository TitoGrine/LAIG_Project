/**
 * Score class 
 * @constructor
 * 
 */
class Score extends CGFobject{
	constructor(scene, prologInterface) {
		super(scene)

		this.points0 = 0
		this.points1 = 0
		
		this.prologInterface  = prologInterface
	}

	askForPoints(){
		this.promise0 = this.prologInterface.getPlayerPoints(0)
		this.promise1 = this.prologInterface.getPlayerPoints(1)
	}
	
	async getPoints(){
		this.points0 = await this.promise0
		this.points1 = await this.promise1
		console.log(this.points0 + " - " + this.points1)
	}

	display(){
		// TODO: fazer
		// console.log("Player 0 points: " + this.points0)
		// console.log("Player 1 points: " + this.points1)
		// console.log(this.points0 + " - " + this.points1)
	}
}
