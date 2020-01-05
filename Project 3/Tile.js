/**
 * Tile
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile in the format [r, g, b]} rgb
 */
class Tile extends CGFobject {

	constructor(scene, id, row, column, tile_color, Piece) {
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

		this.color = tile_color;		
        this.toggle_color = new Toggle(scene, tile_color).getToggleColor();
		
		this.highlight_color = new Toggle(scene, tile_color).getHighlightColor();
	}

	/**
	 * Sets the tile appearence
	 * 
	 * @param {Tile appearence} color 
	 */
	setColor(color){
		this.color = color;		
        this.toggle_color = new Toggle(this.scene, color).getToggleColor();
		this.highlight_color = new Toggle(this.scene, color).getHighlightColor();
	}
	
    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

	/**
	 * Add pointer to the given Piece object
	 * 
	 * @param {Piece object} piece 
	 */
    addPiece(piece){
        this.piece = piece;
        this.piece.move(this.row, this.column, this, this.id);
    }

	/**
	 * Removes the pointer to a Piece
	 */
    remPiece(){
        this.piece = null;
	}
	
	/**
	 * Return current highlight state
	 */
	isHighlight(){
		return this.highlight
	}

	/**
     * Toggles on the piece
     */
	toggle_on(){
        this.toggled = true;
    }

	/**
     * Toggles off the piece
     */
    toggle_off(){
        this.toggled = false;
    }

	/**
     * Inverts current toggle
     */
    toggle(){
        this.toggled = !this.toggled;
	}
	
	/**
	 * Sets highlight state to the given one
	 * 
	 * @param {Highlight state} bool 
	 */
	setHighlight(bool){
		this.highlight = bool
	}

	/**
     * Returns current coordinates
     */
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