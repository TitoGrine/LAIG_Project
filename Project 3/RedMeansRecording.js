/**
 * RedMeansRecording
 * @constructor
 * 
 * @param {Reference to MyScene object} scene 
 */
class RedMeansRecording extends CGFobject {
    constructor(scene){
		super(scene);
		
		// Rectangle where camera will be projected
        this.recording = new MyRectangle(scene, 'recording', -0.9, -0.84, 0.75, 0.85);

		// Camera and Date shaders
        this.dot_shader = new CGFshader(this.scene.gl, "shaders/red.vert", "shaders/red.frag");
		
		// Set date texture to the date shader
        this.dot_shader.setUniformsValues({dateTex : 1});

		// Initialize textures
        this.dotTexture = new CGFtexture(this.scene, "scenes/images/red_dot.png");
        this.default = new CGFtexture(this.scene, "scenes/images/default_texture.jpg");
		
		// Appearance with the noise
		this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.0, 0.0, 0.0, 1);
		this.appearance.setDiffuse(0.0, 0.0, 0.0, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(10);
		this.appearance.setTexture(this.default);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	}
	
	/**
	 * Updates timeFactor for the Camera shader (in seconds)
	 * @param {Current Time} t 
	 */
	setTimeFactor(t){
		this.dot_shader.setUniformsValues({ timeFactor: t / 100 % 10 });
	}

	/**
	 * Displays security camera
	 */
    display(){
		// Applies noise appearance
		this.appearance.apply();
		this.scene.pushMatrix();
		
		// Sets shaders and binds values -> date shader
        this.scene.setActiveShader(this.dot_shader);
        this.dotTexture.bind(1);
        this.recording.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();

    }
}