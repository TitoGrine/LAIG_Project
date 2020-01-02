/**
 * Menu class 
 * @constructor
 * 
 */
class Menu extends CGFobject{
	constructor(scene, id, font, title, options, actions) {
		super(scene)

		this.baseID = id

		this.x = -0.4
		this.y = 0.4
		this.dim = 0.168
		this.dimOption = 0.12

		this.background = [0.0, 0.8, 1.0]
		this.foreground = [0.95, 0.95, 0.95]

		this.options = []

		this.title	= new MyFont(scene, title, font, this.x, this.y, this.dim / 2, this.dim, false, [0.03, 0.6, 0.8])
		for(let i = 0; i < options.length; i++)
			this.options.push(new MenuOption(scene, this.baseID + i, options[i], font, this.x, this.y - this.dim - i * this.dimOption, this.dimOption / 2, this.dimOption, actions[i], this.background, i == options.length - 1 ? null : this.foreground))
	}

	setTitle(title){
		this.title.setString(title)
	}

	setSelectable(bool){
		for(let i = 0; i < this.options.length; i++)
			this.options[i].setSelectable(bool)
	}

	display(){
		this.title.display()
		for(let i = 0; i < this.options.length; i++)
			this.options[i].display()
	}
}
