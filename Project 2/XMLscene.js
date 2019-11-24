var DEGREE_TO_RAD = Math.PI / 180;
var TESTING_MODE = 0;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
		super();
		
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
		super.init(application);
		
		this.sceneInited = false;
		
        this.camera_texture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.security_camera = new MySecurityCamera(this);
        
        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.axis = new CGFaxis(this);
		
		this.texturesStack = [];
		this.materialsStack = [];

		this.displayAxis = true;
		this.displayLights = true;

        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene default camera.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.securityCamera = new CGFcamera(50 * DEGREE_TO_RAD, 0.2, 600, vec3.fromValues(30, 36, 56), vec3.fromValues(30, 20, 41));
    }
	
	/**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
				this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
				this.lights[i].setConstantAttenuation(light[6][0]);
				this.lights[i].setLinearAttenuation(light[6][1]);
				this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0] - light[2][0], light[9][1] - light[2][1], light[9][2]- light[2][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

	/**
	 * Defines and sets Default Appearance
	 */
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
	}
	
    /** 
	 * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

		this.initLights();
		
		this.camera = this.graph.views[this.graph.defView];
		this.securityCamera = this.graph.securityViews[this.graph.defViewSec];
		
		this.interface.setActiveCamera(this.camera);
		this.interface.addLightsGUI();
        this.interface.addCamerasGUI();
        this.interface.addSecurityCamerasGUI();
		
        this.sceneInited = true;
	}

	/**
	 * Push method for the Textures Stack
	 * Returns the current texture
	 * @param {Texture struct to put in the Stack} texture 
	 */
	pushTexture(texture){
		if(texture.textureID == "inherit")
			this.texturesStack.push(this.texturesStack[this.texturesStack.length - 1]);
		else if(texture.textureID == "none")
			this.texturesStack.push(null);
		else
			this.texturesStack.push(texture);
		return this.texturesStack[this.texturesStack.length - 1];
	}

	/**
	 * Pop method for the Textures Stack
	 */
	popTexture(){
		this.texturesStack.pop();
	}

	/**
	 * Push method for the Materials Stack
	 * Returns the current Material
	 * @param {Current Material Struct to put in the Stack} material 
	 */
	pushMaterial(material){
		if(material == "inherit")
			this.materialsStack.push(this.materialsStack[this.materialsStack.length - 1]);
		else
			this.materialsStack.push(material);
		return	this.materialsStack[this.materialsStack.length - 1];
	}

	/**
	 * Pop method for the Materials Stack
	 */
	popMaterial(){
		this.materialsStack.pop();
	}

	/**
	 * Check if the M key is pressed and calls NextMaterial in that case
	 */
	checkKeys()  {
		// Check for key codes e.g. in ​https://keycode.info/
		if (this.gui.isKeyPressed("KeyM"))
			this.graph.nextMaterial();
	}

	/**
	 * Checks periodically if the M key is pressed
	 */
	update(t){
		// Check key values
		this.checkKeys();

		// Updates security camera timeFactor
		this.security_camera.setTimeFactor(t);

		// Updates animations
		if(this.sceneInited)	
			this.graph.updateAnimations(t);
	}

	/**
	 * Enables/disables Lights Visibility
	 */
	turnOffLights(){
		for(let i = 0; i < this.lights.length; i++)
			this.lights[i].setVisible(this.displayLights);
	}

    /**
     * Renders the scene.
     * @param {Camera meant to be used as view for the scene rendering} camera 
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup

        this.camera = camera; // TODO: Really not sure if this is how the teachers wanted it, but I found no better way

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        
        this.applyViewMatrix();

		this.pushMatrix();

		if(this.displayAxis)
        	this.axis.display();

		// Update lights
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the scene and the security camera.
     */
    display() {
        // Stores the main camera being used, since the rendering of the security camera overides it.
        let main_camera = this.camera;
        
        if(!TESTING_MODE){
            this.camera_texture.attachToFrameBuffer();
            this.render(this.securityCamera);
            this.camera_texture.detachFromFrameBuffer();
        }

        this.render(main_camera);
        
        if(!TESTING_MODE){
            this.gl.disable(this.gl.DEPTH_TEST);
            this.security_camera.display();
            this.gl.enable(this.gl.DEPTH_TEST);
        }
    }
}