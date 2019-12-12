/**
 * Piece
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile} 
 */
class Piece extends CGFobject {

	constructor(scene, row, column, geometry, material) {
        super(scene);
        
        this.row = row;
        this.column = column;

        this.geometry = geometry;
        this.material = material;
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    move(row, column){
        this.row = row;
        this.column = column;
    }

    getCoords(){
        return [this.column, this.row];
    }
    
    display(){
        this.scene.pushMatrix();
        this.material.apply();
        this.scene.translate(this.column, 0.0, this.row);
        this.geometry.display();
        this.scene.popMatrix();
    }
}