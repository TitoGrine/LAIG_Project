/**
 * Menu class 
 * @constructor
 * 
 */
class Menu extends CGFobject{
	constructor(scene, id, font, title, options, actions, options_bg, options_fg, title_bg, title_fg) {
		super(scene)

		this.baseID = id

		this.x = -0.4
		this.y = 0.4
		this.dim = 0.168
		this.dimOption = 0.12

		this.options_bg = options_bg
		this.options_fg = options_fg
		this.title_bg = title_bg
		this.title_fg = title_fg

		if(this.title_fg == null || this.title_fg == undefined)
			this.title_fg = this.options_fg

		if(this.title_bg == null || this.title_bg == undefined)
			this.title_bg = this.options_bg
		

		this.options = []

		this.title	= new MyFont(scene, title, font, this.x, this.y, this.dim / 2, this.dim, false, this.title_bg, this.title_fg)
		for(let i = 0; i < options.length; i++)
			this.options.push(new MenuOption(scene, this.baseID + i, options[i], font, this.x, this.y - this.dim - i * this.dimOption, this.dimOption / 2, this.dimOption, actions[i], this.options_bg, this.options_fg))
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
