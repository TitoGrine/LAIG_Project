/**
 * MyPlane
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Plane ID} id 
 * @param {Number of divisions in the U domain} tDivs 
 * @param {Number of divisions in the V domain} sDivs 
 */
class MyPlane extends CGFobject {
	constructor(scene, id, tDivs, sDivs) {
        super(scene);
		this.id = id;
        
        this.tDivs = tDivs;
        this.sDivs = sDivs;

        this.makeSurface();
    }

    /**
     * Creates the NURB surface corresponding to a plane centered in the XZ plane,
     * facing the +Y direction. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeSurface(){
        var nurbsSurface = new CGFnurbsSurface(1, // degree U: to control vertexes on U
                                               1, // degree V: to control vertexes on V
                                               [// U = 0 | V = 0..1;
                                                [[0.5, 0.0, -0.5, 1 ],
                                                 [0.5, 0.0,  0.5, 1 ]],

                                                // U = 1 | V = 0..1;
                                                [[-0.5, 0.0, -0.5, 1 ],
                                                 [-0.5, 0.0,  0.5, 1 ]]
                                               ]);

		this.nurbObject = new CGFnurbsObject(this.scene, this.tDivs, this.sDivs, nurbsSurface);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){

    }
    
    display(){
        this.nurbObject.display();
    }
}