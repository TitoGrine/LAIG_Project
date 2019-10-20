/**
 * MyComponent - represents middle nodes of the graph
 * @constructor
 * @param {Reference to MyScene object} scene 
 * @param {Component ID} id 
 * @param {Component Struct with all the usefull info} component 
 * @param {Boolean indicating if the component was already loaded (with the struct)} loaded
 */
class MyComponent extends CGFobject {
	constructor(scene, id, component, loaded) {
		super(scene);

		this.id = id;

		this.component = component;
		this.currMaterial = null;
		this.currTexture = null;

		this.loaded = loaded;
		this.visited = false; // Helper to the dfs search

		this.currMatIndex = 0;	
	}

	/**
	 * Returns Component ID
	 */
	getID(){
		return this.id;
	}

	/**
	 * Returns Component Children
	 */
	getChildren(){
		return this.component.children;
	}

	/**
	 * Returns boolean indicating whether the dfs already visited this node
	 */
	isVisited(){
		return this.visited;
	}

	/**
	 * Sets the Visited helper flag
	 * @param {Boolean with new visited state} visited 
	 */
	setVisited(visited){
		this.visited = visited;
	}

	/**
	 * Returns boolean indicating whether the component was already loaded with the correct struct
	 */
	isLoaded(){
		return this.loaded; 
	}

	/**
	 * Loads component with new struct in case it wasn't already loaded. Does nothing otherwise
 	 * @param {Component Struct with all the usefull info} component 
	 */
	loadComponent(component){
		if(!this.loaded){
			this.loaded = true;
			this.id = component.ID;
			this.component = component;
		}
	}

	/**
	 * Increments recursively the Current Material Index
	 */
	nextMaterial(){
		// Increments the Material Index of the current Component
		this.currMatIndex = (this.currMatIndex + 1) % this.component.materials.length;

		// Loop through children Components to increment the index recursively
		for(let i = 0; i < this.component.children.length; i++)
			// Checks if it is not a primitive
			if(this.component.children[i] instanceof MyComponent)
				this.component.children[i].nextMaterial();
	}
	
	/**
	 * Recursive display
	 */
	display(){
		// Push Transformation, Material and Textures to the corresponding stacks
		this.scene.pushMatrix();
		this.currMaterial = this.scene.pushMaterial(this.component.materials[this.currMatIndex]);
		this.currTexture = this.scene.pushTexture(this.component.texture);

		// Applies Transformation
		this.scene.multMatrix(this.component.transformation);

		// Applies Texture
		if(this.currTexture != null)
			this.currMaterial.setTexture(this.currTexture.textureID);
		// Applies Material
		this.currMaterial.apply();
		
		// Loop through children to display them recursively
		for(let i = 0; i < this.component.children.length; i++){
			// If it is a primitive applies texture transformations
			if(!(this.component.children[i] instanceof MyComponent) && this.currTexture != null)
				this.component.children[i].updateTexCoords(this.currTexture.length_s, this.currTexture.length_t);
			// Calls child's display method
			this.component.children[i].display();
		}

		// Pop Transformation, Material and Textures from the corresponding stacks
		this.scene.popTexture();
		this.scene.popMaterial();
		this.scene.popMatrix();
	}
}

