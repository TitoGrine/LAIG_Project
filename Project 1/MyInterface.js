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

		// add a group of controls (and open/expand by defult)
		this.gui.add(this.scene, 'displayAxis').name('Axis');   
		this.gui.add(this.scene, 'displayLights').name('Lights Visible').onChange(this.scene.turnOffLights.bind(this.scene));

		this.initKeys();
		

		// TODO: prov apagar
		var cameraNormal = this.gui.addFolder('Normal Camera');
		cameraNormal.add(this.scene, 'near', -3.0, 3.0).step(0.1).name('Near').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'far', 0, 900).step(25).name('Far').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'posX', -20, 175).step(1).name('Pos X').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'posY', -20, 175).step(1).name('Pos Y').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'posZ', -20, 175).step(1).name('Pos Z').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'targetX', -40.0, 40.0).step(1).name('Target X').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'targetY', -40.0, 40.0).step(1).name('Target Y').onChange(this.scene.updateCamera.bind(this.scene));
		cameraNormal.add(this.scene, 'targetZ', -40.0, 40.0).step(1).name('Target Z').onChange(this.scene.updateCamera.bind(this.scene));
		//fim

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

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
	}
	
	addLightsGUI(){
		//Lights
		var keyNames = Object.keys(this.scene.graph.lights);
		var lightsFolder = this.gui.addFolder('Lights');

		for(let i = 0; i < keyNames.length; i++)
			lightsFolder.add(this.scene.lights[i], 'enabled').name(keyNames[i]);
		
	}

	addCamerasGUI(){
		// Camera
		this.gui.add(this.scene.graph, 'curView', Object.keys(this.scene.graph.views)).name('View Points').onChange((val) => {
			this.scene.camera = this.scene.graph.views[val];
			this.setActiveCamera(this.scene.camera);	
		});
	}
}