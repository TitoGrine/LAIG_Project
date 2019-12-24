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

	constructor(scene, id, row, column, geometry, material, Tile) {
		super(scene);
		this.scene = scene
		
		this.id = id
        this.row = row;
		this.column = column;

        this.geometry = geometry;
        this.material = material;
        this.toggled = false;

		this.tile = Tile;
		
		// TODO: depois por como parametro e dar para mudar
		this.selectable = true

        this.toggle_color = new CGFappearance(this.scene);
		this.toggle_color.setAmbient(1.0, 0.0, 0.0, 1);
		this.toggle_color.setDiffuse(1.0, 0.0, 0.0, 1);
		this.toggle_color.setSpecular(0.0, 0.0, 0.0, 1);
        this.toggle_color.setShininess(10);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    move(row, column, Tile, id){
        this.row = row;
        this.column = column;
        this.tile = Tile;
		this.toggle = false;
		this. id = id
    }

    togglePiece(){
        this.toggled = !this.toggled;
    }

    getCoords(){
        return [this.column, this.row];
	}
	    
    display(){
		if (this.selectable)
			this.scene.registerForPick(this.id, this)
			
        this.scene.pushMatrix();
        (this.toggled ? this.toggle_color.apply() : this.material.apply());
        this.scene.translate(this.column, 0.0, this.row);
        this.geometry.display();
		this.scene.popMatrix();
		
		if(this.selectable)
			this.scene.clearPickRegistration()
    }
}