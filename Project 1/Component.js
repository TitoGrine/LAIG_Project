/**
 * MyTorus
 * @constructor
 * @param {Reference to MyScene object} scene 
 * 
 */
class Component extends CGFobject {
	constructor(scene, component) {
		super(scene);

		this.component = component;

	}
	
	display(){
		this.scene.pushMatrix();

		// Aplicar Transformações
		this.scene.multMatrix(this.component.transformation);
		// Aplicar Material
		// Aplicar Texture
		
		// Loop  childs
		for(let i = 0; i < this.component.children.length; i++)
			this.component.children[i].display();

		this.scene.popMatrix();
	}
}

