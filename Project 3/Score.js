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

		this.fontPoints0 = new MyFont(scene, "WHITE: ")
		this.fontPoints1 = new MyFont(scene, "BLACK: ")
	}

	askForPoints(){
		this.promise0 = this.prologInterface.getPlayerPoints(0)
		this.promise1 = this.prologInterface.getPlayerPoints(1)
	}
	
	async getPoints(){
		this.points0 = await this.promise0
		this.points1 = await this.promise1
		this.fontPoints0.setString("WHITE: " + this.points0)
		this.fontPoints1.setString("BLACK: " + this.points1)
		
		// console.log(this.points0 + " - " + this.points1)
	}

	display(){
		this.scene.pushMatrix()
		this.fontPoints0.display()
    	this.scene.translate(0, -1, 0);
		this.fontPoints1.display()

		this.scene.popMatrix()
		// TODO: fazer
		// console.log("Player 0 points: " + this.points0)
		// console.log("Player 1 points: " + this.points1)
		// console.log(this.points0 + " - " + this.points1)
	}
}
