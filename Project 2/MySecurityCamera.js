/**
 * MySecurityCamera
 * @constructor
 */
class MySecurityCamera extends CGFobject {
    constructor(scene){
        super(scene);
        this.projection = new MyRectangle(scene, 'camera', 0.5, 1, -1.0, -0.5);
        this.date = new MyRectangle(scene, 'date', 0.51, 0.66, -0.57, -0.51);

        this.camera_shader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
        this.date_shader = new CGFshader(this.scene.gl, "shaders/date.vert", "shaders/date.frag");
    
        this.camera_shader.setUniformsValues({cameraTex : 1});
        this.date_shader.setUniformsValues({dateTex : 1});

        this.dateTexture = new CGFtexture(this.scene, "scenes/images/date.png");
    }

    display(){
        this.scene.pushMatrix();

        this.scene.setActiveShader(this.camera_shader);
        this.scene.camera_texture.bind(1);
        this.projection.display();
        
        this.scene.setActiveShader(this.date_shader);
        this.dateTexture.bind(1);
        this.date.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();

    }
}