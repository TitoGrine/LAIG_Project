/**
 * Tile
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile in the format [r, g, b]} rgb
 */
class Tile extends CGFobject {

	constructor(scene, id, row, column, rgb, Piece) {
		super(scene);
		this.scene = scene
		this.id = id
		
        this.row = row;
        this.column = column;
		this.toggled = false;
		this.highlight = false
		
		// TODO: depois por como parametro e dar para mudar
		this.selectable = true

        this.piece = Piece;

        this.plane = new MyPlane(this.scene, 'plane', 30, 30);

        this.color = new CGFappearance(this.scene);
		this.color.setAmbient(rgb[0], rgb[1], rgb[2], 1);
		this.color.setDiffuse(rgb[0], rgb[1], rgb[2], 1);
		this.color.setSpecular(0.0, 0.0, 0.0, 1);
		this.color.setShininess(10);		

        this.toggle_color = new CGFappearance(this.scene);
		this.toggle_color.setAmbient(1.0, 0.0, 0.0, 1);
		this.toggle_color.setDiffuse(1.0, 0.0, 0.0, 1);
		this.toggle_color.setSpecular(0.0, 0.0, 0.0, 1);
		this.toggle_color.setShininess(10);
		
		// TODO: refactor
		this.highlight_color = new CGFappearance(this.scene);
		this.highlight_color.setAmbient(1.0, 0.84, 0.0, 1);
		this.highlight_color.setDiffuse(1.0, 0.84, 0.0, 1);
		this.highlight_color.setSpecular(0.0, 0.84, 0.0, 1);
		this.highlight_color.setShininess(10);
		
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    addPiece(piece){
        this.piece = piece;
        this.piece.move(this.row, this.column, this, this.id);
    }

    remPiece(){
        this.piece = null;
	}
	
	isHighlight(){
		return this.highlight
	}

	toggle_on(){
        this.toggled = true;
    }

    toggle_off(){
        this.toggled = false;
    }

    toggle(){
        this.toggled = !this.toggled;
	}
	
	setHighlight(bool){
		this.highlight = bool
	}

    getCoords(){
        return [this.column, this.row];
	}
	
    display(){
		if (this.selectable)
			this.scene.registerForPick(this.id, this)
//			this.scene.registerForPick(this.id, this.toggle.bind(this))



        this.scene.pushMatrix();
        this.toggled ? this.toggle_color.apply() : (this.highlight ? this.highlight_color.apply() : this.color.apply())
        this.scene.translate(0.5 + this.column, 0.0, 0.5 + this.row);
        this.scene.scale(0.9, 1.0, 0.9);
        this.plane.display();
		this.scene.popMatrix();
		
		if(this.selectable)
			this.scene.clearPickRegistration()
    }
}