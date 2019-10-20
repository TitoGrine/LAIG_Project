/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

		// Display Axis CheckBox
		this.gui.add(this.scene, 'displayAxis').name('Axis');  
		// CheckBox to set the lights as visible 
		this.gui.add(this.scene, 'displayLights').name('Lights Visible').onChange(this.scene.turnOffLights.bind(this.scene));

		this.initKeys();
		

		/*
		if(this.scene.testCamera){
			var cameraNormal = this.gui.addFolder('Camera');
			cameraNormal.add(this.scene, 'near', -3.0, 3.0).step(0.1).name('Near').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'far', 0, 900).step(25).name('Far').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'posX', -60, 175).step(1).name('Pos X').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'posY', -60, 750).step(1).name('Pos Y').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'posZ', -60, 175).step(1).name('Pos Z').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'targetX', -80.0, 150.0).step(1).name('Target X').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'targetY', -80.0, 150.0).step(1).name('Target Y').onChange(this.scene.updateCamera.bind(this.scene));
			cameraNormal.add(this.scene, 'targetZ', -80.0, 150.0).step(1).name('Target Z').onChange(this.scene.updateCamera.bind(this.scene));
			if(this.scene.ortho){
				cameraNormal.add(this.scene, 'upX', -1, 1).step(1).name('Up X').onChange(this.scene.updateCamera.bind(this.scene));
				cameraNormal.add(this.scene, 'upY', -1, 1).step(1).name('Up Y').onChange(this.scene.updateCamera.bind(this.scene));
				cameraNormal.add(this.scene, 'upZ', -1, 1).step(1).name('Up Z').onChange(this.scene.updateCamera.bind(this.scene));
				
				cameraNormal.add(this.scene, 'left', -150, 20).step(1).name('Left').onChange(this.scene.updateCamera.bind(this.scene));
				cameraNormal.add(this.scene, 'right', 21, 150).step(1).name('Right').onChange(this.scene.updateCamera.bind(this.scene));
				cameraNormal.add(this.scene, 'bottom', -70, 20).step(1).name('Bottom').onChange(this.scene.updateCamera.bind(this.scene));
				cameraNormal.add(this.scene, 'top', 21, 70).step(1).name('Top').onChange(this.scene.updateCamera.bind(this.scene));
			}
		}
		//fim
		*/

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

	/**
	 * Process Event in case of key pressed
	 */
    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

	/**
	 * Process Event in case of Key release
	 */
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

	/**
	 * Checks if the key is pressed
	 * @param {KeyCode of the desired key} keyCode 
	 */
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
	}
	
	/**
	 * Add Lights Folder to the interface
	 */
	addLightsGUI(){
		// Extract lights names
		var keyNames = Object.keys(this.scene.graph.lights);
		// Create Folder
		var lightsFolder = this.gui.addFolder('Lights');

		// Add Lights to the folder
		for(let i = 0; i < keyNames.length; i++)
			lightsFolder.add(this.scene.lights[i], 'enabled').name(keyNames[i]);
		
	}

	/**
	 * Add Cameras Dropdown to the interface
	 */
	addCamerasGUI(){
		this.gui.add(this.scene.graph, 'curView', Object.keys(this.scene.graph.views)).name('View Points').onChange((val) => {
			// In case of new camera selected, changes the scene camera
			this.scene.camera = this.scene.graph.views[val];
			// and sets it as the active camera
			this.setActiveCamera(this.scene.camera);	
		});
	}
}