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

		
		// TODO: depois por como parametro e dar para mudar
		this.selectable = true

    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    move(row, column, Tile, id){
        this.row = row;
        this.column = column;
        this.tile = Tile;
		this.toggled = false;
		this.id = id
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

    getCoords(){
        return [this.column, this.row];
    }
    
    updateAnimation(animation){
        this.animation = animation;
    }

    reset(){
        this.row = this.starting_row;
		this.column = this.starting_column;
    }
	    
    display(){
		if (this.selectable)
			this.scene.registerForPick(this.id, this)
//			this.scene.registerForPick(this.id, this.toggle.bind(this))
			
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