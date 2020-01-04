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
		this.gui.add(this.scene, 'angle', this.scene.angles).name("Camera Rotation").onChange(() => this.scene.rotatingCamera = true);

		this.initKeys();
		
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

	/**
	 * Add Security Cameras Dropdown to the interface
	 */
	addSecurityCamerasGUI(){
		this.gui.add(this.scene.graph, 'curSecurityCamera', Object.keys(this.scene.graph.securityViews)).name('Security Cameras').onChange((val) => {
			// In case of new camera selected, changes the scene camera
			this.scene.securityCamera = this.scene.graph.securityViews[val];	
		});
	}
}