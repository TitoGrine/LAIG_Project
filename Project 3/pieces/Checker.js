/**
 * Checker
 * @constructor
 * @param {Reference to MyScene object} scene
 */
class Checker extends Geometry {

	constructor(scene) {
        super(scene);

        this.cylinder = new MyNurbCylinder(this.scene, 'cylinder', 0.35, 0.35, 0.4, 30, 30);
        this.circle = new MyCircle(this.scene, 50, 0.35);
    }

    // Does nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    /**
     * 
     * @param {Duration of the animation} span 
     */
    getAnimation(span){
        return new BasicAnimation(this.scene, span)
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