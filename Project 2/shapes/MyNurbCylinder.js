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

    /**
     * Builds all the control points arrays necessary for the cylinder.
     * Since the cylinder is built using two patch surfaces each creating half of
     * the cylinder, and since the cylinder is double sided (interior is also visible),
     * the total number of control points arrays necessary is 4.
     * The cylinder will be centered in the origin.
     */
    buildCPVector(){
        
        var h = 4.0 / 3.0;
        var half_height = this.height / 2.0;

        this.top_control_points1 = [// U = 0 | V = 0..1;
                                   [[this.base_radius, 0.0, -half_height, 1],
                                       [this.top_radius, 0.0, half_height, 1]],
                                   // U = 1 | V = 0..1;
                                   [[this.base_radius, h * this.base_radius, -half_height, 1],
                                       [this.top_radius, h * this.top_radius, half_height, 1]],
                                   // U = 2 | V = 0..1;
                                   [[-this.base_radius, h * this.base_radius, -half_height, 1],
                                       [-this.top_radius, h * this.top_radius, half_height, 1]],
                                   // U = 3 | V = 0..1;
                                   [[-this.base_radius, 0.0, -half_height, 1],
                                       [-this.top_radius, 0.0, half_height, 1]]
                                  ];

        this.top_control_points2 = [// U = 0 | V = 0..1;
                                   [[this.top_radius, 0.0, half_height, 1],
                                       [this.base_radius, 0.0, -half_height, 1]],
                                   // U = 1 | V = 0..1;
                                   [[this.top_radius, h * this.top_radius, half_height, 1],
                                       [this.base_radius, h * this.base_radius, -half_height, 1]],
                                   // U = 2 | V = 0..1;
                                   [[-this.top_radius, h * this.top_radius, half_height, 1],
                                       [-this.base_radius, h * this.base_radius, -half_height, 1]],
                                   // U = 3 | V = 0..1;
                                   [[-this.top_radius, 0.0, half_height, 1],
                                       [-this.base_radius, 0.0, -half_height, 1]]
                                  ];

        this.bottom_control_points1 = [// U = 0 | V = 0..1;
                                      [[-this.base_radius, 0.0, -half_height, 1],
                                          [-this.top_radius, 0.0, half_height, 1]],
                                      // U = 1 | V = 0..1;
                                      [[-this.base_radius, -h * this.base_radius, -half_height, 1],
                                          [-this.top_radius, -h * this.top_radius, half_height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.base_radius, -h * this.base_radius, -half_height, 1],
                                          [this.top_radius, -h * this.top_radius, half_height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.base_radius, 0.0, -half_height, 1],
                                          [this.top_radius, 0.0, half_height, 1]]
                                     ];

        this.bottom_control_points2 = [// U = 0 | V = 0..1;
                                      [[-this.top_radius, 0.0, half_height, 1],
                                          [-this.base_radius, 0.0, -half_height, 1]],
                                      // U = 1 | V = 0..1;
                                      [[-this.top_radius, -h * this.top_radius, half_height, 1],
                                          [-this.base_radius, -h * this.base_radius, -half_height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.top_radius, -h * this.top_radius, half_height, 1],
                                          [this.base_radius, -h * this.base_radius, -half_height, 1]],
                                      // U = 2 | V = 0..1;
                                      [[this.top_radius, 0.0, half_height, 1],
                                          [this.base_radius, 0.0, -half_height, 1]]
                                     ];
    }

    /**
     * Creates the NURB surface corresponding to the control points
     * given. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeSurface(){

        var top_nurbsSurface1 = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                   1, // degree V: to control vertexes on V
                                                   this.top_control_points1);

        var top_nurbsSurface2 = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                   1, // degree V: to control vertexes on V
                                                   this.top_control_points2);

        var bottom_nurbsSurface1 = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                      1, // degree V: to control vertexes on V
                                                      this.bottom_control_points1);

        var bottom_nurbsSurface2 = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                      1, // degree V: to control vertexes on V
                                                      this.bottom_control_points2);
       

        this.top_nurbObject1 = new CGFnurbsObject(this.scene, this.slices, this.stacks, top_nurbsSurface1);
        this.top_nurbObject2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, top_nurbsSurface2);
        this.bottom_nurbObject1 = new CGFnurbsObject(this.scene, this.slices, this.stacks, bottom_nurbsSurface1);
        this.bottom_nurbObject2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, bottom_nurbsSurface2);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    display(){
        this.top_nurbObject1.display();
        this.top_nurbObject2.display();
        this.bottom_nurbObject1.display();
        this.bottom_nurbObject2.display();
    }
}