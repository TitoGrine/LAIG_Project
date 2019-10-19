/**
 * MyTorus
 * @constructor
 * @param {Reference to MyScene object} scene 
 * 
 */
class MyComponent extends CGFobject {
	constructor(scene, id, component, loaded) {
		super(scene);

		this.id = id;

		this.component = component;
		this.currMaterial = null;
		this.currTexture = null;

		this.loaded = loaded;
		this.visited = false;

		this.currMatIndex = 0;	
	}

	getID(){
		return this.id;
	}

	getChildren(){
		return this.component.children;
	}

	isVisited(){
		return this.visited;
	}

	setVisited(visited){
		this.visited = visited;
	}

	isLoaded(){
		return this.loaded; 
	}

	loadComponent(component){
		if(!this.loaded){
			this.loaded = true;
			this.id = component.ID;
			this.component = component;
		}
	}

	pushTexture(){
		// 0: id/ texture; 1: length_s
		if(this.component.texture.textureID == "inherit")
			this.scene.texturesStack.push(this.scene.texturesStack[this.scene.texturesStack.length - 1]);
		else if(this.component.texture.textureID == "none")
			this.scene.texturesStack.push(null);
		else
			this.scene.texturesStack.push(this.component.texture);

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
			if(this.component.children[i] instanceof MyComponent)
				this.component.children[i].nextMaterial();
	}
	
	display(){
		this.scene.pushMatrix();
		this.pushMaterial();
		this.pushTexture();

		// Aplicar Transformações
		this.scene.multMatrix(this.component.transformation);

		// Aplicar Texture
		this.currMaterial.setTexture(this.currTexture.textureID);
		// Aplicar Material
		this.currMaterial.apply();
		
		// Loop  childs
		for(let i = 0; i < this.component.children.length; i++){
			// TODO: ver se inherit herdam length_s/t qd n presentes
			if(!(this.component.children[i] instanceof MyComponent))
				this.component.children[i].updateTexCoords(this.currTexture.length_s || 1, this.currTexture.length_t || 1);
			this.component.children[i].display();
		}

		this.scene.texturesStack.pop();
		this.scene.materialsStack.pop();
		this.scene.popMatrix();
	}
}

