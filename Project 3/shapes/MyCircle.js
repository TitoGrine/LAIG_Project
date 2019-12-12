/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCircle extends CGFobject {

	constructor(scene, n_divs, radius) {
		super(scene);

        this.radius = radius;
        this.n_divs = n_divs;

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

        this.top_control_points = [// U = 0 | V = 0..1;
                                   [[this.radius, 0.0, 0.0, 1],
                                       [this.radius, 0.0, 0.0, 1]],
                                   // U = 1 | V = 0..1;
                                   [[this.radius, h * this.radius, 0.0, 1],
                                       [this.radius, 0.0, 0.0, 1]],
                                   // U = 2 | V = 0..1;
                                   [[-this.radius, h * this.radius, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]],
                                   // U = 3 | V = 0..1;
                                   [[-this.radius, 0.0, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]]
                                  ];

        this.bottom_control_points = [// U = 0 | V = 0..1;
                                   [[-this.radius, 0.0, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]],
                                   // U = 1 | V = 0..1;
                                   [[-this.radius, -h * this.radius, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]],
                                   // U = 2 | V = 0..1;
                                   [[this.radius, -h * this.radius, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]],
                                   // U = 3 | V = 0..1;
                                   [[this.radius, 0.0, 0.0, 1],
                                       [-this.radius, 0.0, 0.0, 1]]
                                  ];
    }

    /**
     * Creates the NURB surface corresponding to the control points
     * given. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeSurface(){

        var top_nurbsSurface = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                   1, // degree V: to control vertexes on V
                                                   this.top_control_points);

        var bottom_nurbsSurface = new CGFnurbsSurface(3, // degree U: to control vertexes on U
                                                   1, // degree V: to control vertexes on V
                                                   this.bottom_control_points);
       

        this.top_nurbObject = new CGFnurbsObject(this.scene, this.n_divs, this.n_divs, top_nurbsSurface);
        this.bottom_nurbObject = new CGFnurbsObject(this.scene, this.n_divs, this.n_divs, bottom_nurbsSurface);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }

    display(){
        this.top_nurbObject.display();
        this.bottom_nurbObject.display();
    }
}