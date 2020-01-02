/**
 * Piece
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile} 
 */
class Checker extends CGFobject {

	constructor(scene) {
        super(scene);

        this.cylinder = new MyNurbCylinder(this.scene, 'cylinder', 0.35, 0.35, 0.4, 30, 30);
        this.circle = new MyCircle(this.scene, 50, 0.35);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }
    
    display(){
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0.2, 0.5);
        this.scene.rotate(Math.PI/2.0, 1.0, 0.0, 0.0);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0.4, 0.5);
        this.scene.rotate(-Math.PI/2.0, 1.0, 0.0, 0.0);
        this.circle.display();
        this.scene.popMatrix();
    }
}