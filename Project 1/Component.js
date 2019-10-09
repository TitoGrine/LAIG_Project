/**
 * MyTorus
 * @constructor
 * @param {Reference to MyScene object} scene 
 * 
 */
class Component extends CGFobject {
	constructor(scene, component, loaded) {
		super(scene);

		this.component = component;
		this.currMaterial = null;
		this.currTexture = null;

		this.loaded = loaded;

		this.currMatIndex = 0;		
	}

	isLoaded(){
		return this.loaded; 
	}

	loadComponent(component){
		if(!this.loaded){
			this.loaded = true;
			this.component = component;
		}
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
		// Loop  childs
		for(let i = 0; i < this.component.children.length; i++)
			if(this.component.children[i] instanceof Component)
				this.component.children[i].nextMaterial();
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
		for(let i = 0; i < this.component.children.length; i++){
			// TODO: ver se inherit herdam length_s/t qd n presentes
			if(!(this.component.children[i] instanceof Component))
				this.component.children[i].updateTexCoords(this.component.texture.length_s || 1, this.component.texture.length_t || 1);
			this.component.children[i].display();
		}

		this.scene.texturesStack.pop();
		this.scene.materialsStack.pop();
		this.scene.popMatrix();
	}
}

