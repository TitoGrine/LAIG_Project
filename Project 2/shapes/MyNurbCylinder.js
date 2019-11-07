/**
* MyNurbCylinder
* @constructor
* @param {Reference to MyScene object} scene 
* @param {Cylinder ID} id
* @param {Radius of the Base Circle} base_radius 
* @param {Radius of the Top Circle} top_radius 
* @param {Height of the Cylinder} height 
* @param {Number of divisions around the circunference} slices 
* @param {Number of divisions along the height} stacks 
*/
class MyNurbCylinder extends CGFobject {
    constructor(scene, id, base_radius, top_radius, height, slices, stacks) {
        super(scene);

        this.id = id;
        this.base_radius = base_radius;
        this.top_radius = top_radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.buildCPVector();
        this.makeSurface();
    }

    buildCPVector(){
        
        var h = 4.0 / 3.0;

        this.top_control_points = [// U = 0 | V = 0..1;
                                   [[this.base_radius, 0.0, 0.0, 1],
                                       [this.top_radius, 0.0, this.height, 1]],
                                   // U = 1 | V = 0..1;
                                   [[this.base_radius, h * this.base_radius, 0.0, 1],
                                       [this.top_radius, h * this.top_radius, this.height, 1]],
                                   // U = 2 | V = 0..1;
                                   [[-this.base_radius, h * this.base_radius, 0.0, 1],
                                       [-this.top_radius, h * this.top_radius, this.height, 1]],
                                   // U = 3 | V = 0..1;
                                   [[-this.base_radius, 0.0, 0.0, 1],
                                       [-this.top_radius, 0.0, this.height, 1]]
                                  ];

        this.bottom_control_points = [// U = 0 | V = 0..1;
                                      [[-this.base_radius, 0.0, 0.0, 1],
                                          [-this.top_radius, 0.0, this.height, 1]],
                                      // U = 1 | V = 0..1;
                                      [[-this.base_radius, -h * this.base_radius, 0.0, 1],
                                          [-this.top_radius, -h * this.top_radius, this.height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.base_radius, -h * this.base_radius, 0.0, 1],
                                          [this.top_radius, -h * this.top_radius, this.height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.base_radius, 0.0, 0.0, 1],
                                          [this.top_radius, 0.0, this.height, 1]]
                                     ];
    }

    makeSurface(){

        var top_nurbsSurface = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                   1, // degree V: to control vertexes on V
                                                   this.top_control_points);

        var bottom_nurbsSurface = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                      1, // degree V: to control vertexes on V
                                                      this.bottom_control_points);
       

        this.top_nurbObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, top_nurbsSurface);
        this.bottom_nurbObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, bottom_nurbsSurface);
    }

    updateTexCoords(lengthS, lengthT){

    }

    display(){
        this.top_nurbObject.display();
        this.bottom_nurbObject.display();
    }
}