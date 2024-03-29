/**
 * MySecurityCamera
 * @constructor
 * 
 * @param {Reference to MyScene object} scene 
 */
class MySecurityCamera extends CGFobject {
    constructor(scene){
		super(scene);
		
		// Rectangle where camera will be projected
		this.projection = new MyRectangle(scene, 'camera', 0.5, 1, -1.0, -0.5);
        this.date = new MyRectangle(scene, 'date', 0.51, 0.66, -0.57, -0.51);

		// Camera and Date shaders
        this.camera_shader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
        this.date_shader = new CGFshader(this.scene.gl, "shaders/date.vert", "shaders/date.frag");
		
		// Set time, view texture and noise texture to the camera
		this.camera_shader.setUniformsValues({timeFactor: 0, cameraTex : 1, noiseText: 2});
		// Set date texture to the date shader
        this.date_shader.setUniformsValues({dateTex : 1});

		// Initialize textures
		this.dateTexture = new CGFtexture(this.scene, "scenes/images/date.png");
		this.noiseTexture = new CGFtexture(this.scene, "scenes/images/noise.jpg");
		
		// Appearance with the noise
		this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(10);
		this.appearance.setTexture(this.noiseTexture);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');

	}
	
	/**
	 * Updates timeFactor for the Camera shader (in seconds)
	 * @param {Current Time} t 
	 */
	setTimeFactor(t){
		this.camera_shader.setUniformsValues({ timeFactor: t / 1000 % 1000 });
	}

	/**
	 * Displays security camera
	 */
    display(){
		// Applies noise appearance
		this.appearance.apply();
		this.scene.pushMatrix();
		
		// Sets shaders and binds values -> security camera
        this.scene.setActiveShader(this.camera_shader);
		this.scene.camera_texture.bind(1);
		this.noiseTexture.bind(2);
		this.projection.display();
		
		// Sets shaders and binds values -> date shader
        this.scene.setActiveShader(this.date_shader);
        this.dateTexture.bind(1);
        this.date.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();

    }
}