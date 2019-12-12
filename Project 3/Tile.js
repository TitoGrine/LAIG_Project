/**
 * MyTile
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Number of divisions in the U domain} tDivs 
 * @param {Number of divisions in the V domain} sDivs 
 */
class Tile extends CGFobject {

	constructor(scene, row, column, rgb) {
        super(scene);
        
        this.row = row;
        this.column = column;
        this.toggled = false;

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
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    toggle(){
        this.toggled = !this.toggled;
    }

    getCoords(){
        return [this.column, this.row];
    }
    
    display(){
        this.scene.pushMatrix();
        (this.toggled ? this.toggle_color.apply() : this.color.apply());
        this.scene.translate(0.5, 0.0, 0.5);
        this.scene.scale(0.9, 1.0, 0.9);
        this.plane.display();
        this.scene.popMatrix();
    }
}