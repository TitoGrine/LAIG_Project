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
		this.currMaterial = null;
		this.currTexture = null;

		this.currMatIndex = 0;		
	}

	pushTexture(){
		if(this.component.texture.textureID == "inherit")
			this.scene.texturesStack.push(this.scene.texturesStack[this.scene.texturesStack.length - 1]);
		else if(this.component.texture.textureID == "none")
			this.scene.texturesStack.push(null);
		else
			this.scene.texturesStack.push(this.component.texture.textureID);

		this.currTexture = this.scene.texturesStack[this.scene.texturesStack.length - 1];
	}

	pushMaterial(){
		if(this.component.materials[this.currMatIndex] == "inherit")
			this.scene.materialsStack.push(this.scene.materialsStack[this.scene.materialsStack.length - 1]);
		else
			this.scene.materialsStack.push(this.component.materials[this.currMatIndex]);
		this.currMaterial = this.scene.materialsStack[this.scene.materialsStack.length - 1];
	}

	nextMaterial(){
		this.currMatIndex = (this.currMatIndex + 1) % this.component.materials.length;
	}
	
	display(){
		this.scene.pushMatrix();
		this.pushMaterial();
		this.pushTexture();

		// Aplicar Transformações
		this.scene.multMatrix(this.component.transformation);

		// Aplicar Texture
		this.currMaterial.setTexture(this.currTexture);
		// Aplicar Material
		this.currMaterial.apply();
		
		// Loop  childs
		for(let i = 0; i < this.component.children.length; i++)
			this.component.children[i].display();

		this.scene.texturesStack.pop();
		this.scene.materialsStack.pop();
		this.scene.popMatrix();
	}
}

