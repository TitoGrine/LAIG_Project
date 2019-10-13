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
		var lightsFolder = this.gui.addFolder('Lights');
		let i = 0;
		for(var key in this.scene.graph.lights){
			lightsFolder.add(this.scene.graph.lights[key], '0').name(key).onChange((val) => this.scene.turnOffLight(i, val));
			i++;
		}
	}

	addCamerasGUI(){
		// Camera
		this.gui.add(this.scene.graph, 'curView', Object.keys(this.scene.graph.views)).name('View Points').onChange((val) => {
			this.scene.camera = this.scene.graph.views[val];
			this.setActiveCamera(this.scene.camera);	
		});
	}
}