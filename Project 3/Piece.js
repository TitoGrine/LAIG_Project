/**
 * Piece
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Unique id corresponding to the initial position} id
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile} 
 */
class Piece extends CGFobject {

	constructor(scene, id, type, row, column, geometry, material, Tile) {
		super(scene);
		this.scene = scene

		this.id = id
		this.type = type
        this.starting_row = row;
        this.starting_column = column;
        this.row = row;
		this.column = column;

        this.geometry = geometry;
        this.material = material;
        this.toggle_color = new Toggle(scene, material).getToggleColor();
		this.toggled = false;

        this.tile = Tile;
        
        this.animation = mat4.create();
        mat4.identity(this.animation);
		
		this.selectable = true
	}

    /**
     * Return piece type.
     */
	getType(){
		return this.type
	}

    /**
     * Sets current appearence of the piece.
     * 
     * @param {Piece geometry} geometry 
     * @param {Piece material} material 
     */
	setAppearance(geometry, material){
		this.geometry = geometry;
        this.material = material;
        this.toggle_color = new Toggle(this.scene, this.material).getToggleColor();
	}

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    /**
     * Changes current position to the given coordinates and Tile.
     * 
     * @param {New row} row 
     * @param {New column} column 
     * @param {New tile} Tile 
     * @param {New id} id 
     */
    move(row, column, Tile, id){
        this.row = row;
        this.column = column;
        this.tile = Tile;
		this.toggled = false;
		this.id = id
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
     * Returns current coordinates
     */
    getCoords(){
        return [this.column, this.row];
    }
    
    /**
     * Updates the animation matrix
     * 
     * @param {animation matrix} animation 
     */
    updateAnimation(animation){
        this.animation = animation;
    }

    /**
     * Resets position to starting position
     */
    reset(){
        this.row = this.starting_row;
		this.column = this.starting_column;
    }
	    
    display(){
		if (this.selectable)
			this.scene.registerForPick(this.id, this)
			
        this.scene.pushMatrix();
        (this.toggled ? this.toggle_color.apply() : this.material.apply());
        this.scene.translate(this.column, 0.0, this.row);
        this.scene.multMatrix(this.animation);
        this.geometry.display();
		this.scene.popMatrix();
		
		if(this.selectable)
			this.scene.clearPickRegistration()
    }
}