/**
 * Piece
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Board row where the tile is} row 
 * @param {Board column where the tile is} column
 * @param {RGB color of the tile} 
 */
class Crystal extends CGFobject {

	constructor(scene) {
        super(scene);

        this.angle = Math.PI * Math.random();

        this.triangle1  = new MyTriangle(scene, 'id',  0.3, 0.9,  0.1, 0.0, 0.0, 0.0,  0.0, 0.5,  0.3);
        this.triangle2  = new MyTriangle(scene, 'id',  0.1, 0.7, -0.4, 0.0, 0.0, 0.0,  0.3, 0.9,  0.1);
        this.triangle3  = new MyTriangle(scene, 'id', -0.3, 0.8, -0.2, 0.0, 0.0, 0.0,  0.1, 0.7, -0.4);
        this.triangle4  = new MyTriangle(scene, 'id', -0.3, 1.3,  0.1, 0.0, 0.0, 0.0, -0.3, 0.8, -0.2);
        this.triangle5  = new MyTriangle(scene, 'id',  0.0, 0.5,  0.3, 0.0, 0.0, 0.0, -0.3, 1.3,  0.1);
        this.triangle6  = new MyTriangle(scene, 'id',  0.3, 0.9,  0.1, 0.0, 2.5, 0.0,  0.0, 0.5,  0.3);
        this.triangle7  = new MyTriangle(scene, 'id',  0.1, 0.7, -0.4, 0.0, 2.5, 0.0,  0.3, 0.9,  0.1);
        this.triangle8  = new MyTriangle(scene, 'id', -0.3, 0.8, -0.2, 0.0, 2.5, 0.0,  0.1, 0.7, -0.4);
        this.triangle9  = new MyTriangle(scene, 'id', -0.3, 1.3,  0.1, 0.0, 2.5, 0.0, -0.3, 0.8, -0.2);
        this.triangle10 = new MyTriangle(scene, 'id',  0.0, 0.5,  0.3, 0.0, 2.5, 0.0, -0.3, 1.3,  0.1);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }
    
    getAnimation(span){
        return new LevitationAnimation(this.scene, span)
    }

    display(){
        this.scene.pushMatrix();

        this.scene.translate(0.5, 0.0, 0.5);
        this.scene.rotate(this.angle, 0.0, 1.0, 0.0)
        
        this.triangle1.display();
        this.triangle2.display();
        this.triangle3.display();
        this.triangle4.display();
        this.triangle5.display();
        this.triangle6.display();
        this.triangle7.display();
        this.triangle8.display();
        this.triangle9.display();
        this.triangle10.display();

        this.scene.popMatrix();
    }
}