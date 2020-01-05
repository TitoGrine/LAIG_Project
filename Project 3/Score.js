/**
 * Score class 
 * @constructor
 * 
 */
class Score extends CGFobject{
	constructor(scene, prologInterface, font) {
		super(scene)

		this.points0 = 0
		this.points1 = 0
		
		this.prologInterface  = prologInterface
		this.x = font.x
		this.y = font.y
		this.height = font.height
		this.width = font.width
		this.fontPoints0 = new MyFont(scene, "Player  1: 00", font.texture, this.x, this.y, this.width, this.height, true)
		this.fontPoints1 = new MyFont(scene, "Player  2: 00", font.texture, this.x, this.y - this.height, this.width, this.height, true)
		this.result = new MyFont(scene, "             ", font.texture,this.x, this.y - 2 * this.height, this.width, this.height, true)

		this.highlightPlayer()
	}

	askForPoints(){
		this.promise0 = this.prologInterface.getPlayerPoints(0)
		this.promise1 = this.prologInterface.getPlayerPoints(1)
	}

	highlightPlayer(player){
		switch (player) {
			case 0:
				this.fontPoints0.setColor([1.0,1.0,1.0,1.0], [0.0,0.0,0.0,1.0])
				this.fontPoints1.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				break;
			case 1:
				this.fontPoints1.setColor([1.0,1.0,1.0,1.0], [0.0,0.0,0.0,1.0])
				this.fontPoints0.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				break;
			case 3:
				this.fontPoints0.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				this.fontPoints1.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				if(this.points0 == this.points1){
					this.result.setString("    DRAW     ")
					this.result.setColor([0.0,0.0,0.0,1.0], [0.0,0.68,0.98,1.0])
				}
				else if(this.points0 > this.points1){
					this.result.setString("  WINNER  1  ")
					this.result.setColor([0.0,0.0,0.0,1.0], [66 / 255, 245/255, 96/255,1.0])
				}
				else {
					this.result.setString("  WINNER  2  ")
					this.result.setColor([0.0,0.0,0.0,1.0], [66 / 255, 245/255, 96/255,1.0])
				}
				break;
			case 4:
				this.result.setString("")
				break;
			default:
				this.fontPoints0.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				this.fontPoints1.setColor([0.0,0.0,0.0,1.0], [1.0,1.0,1.0,1.0])
				this.result.setString("             ")
				break;
		}
	}
	
	async getPoints(){
		this.points0 = await this.promise0
		this.points1 = await this.promise1
		if(this.points0 < 10)
			this.fontPoints0.setString("Player  1: 0" + this.points0)
		else
			this.fontPoints0.setString("Player  1:  " + this.points0)

		if(this.points1 < 10)
			this.fontPoints1.setString("Player  2: 0" + this.points1)
		else
			this.fontPoints1.setString("Player  2:  " + this.points1)		
	}

	display(){
		this.fontPoints0.display()
		this.fontPoints1.display()
		this.result.display()
	}
}
