/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Plane ID
 * @param tDivs - 
 * @param sDivs - 
 */
class MyPlane extends CGFobject {
	constructor(scene, id, tDivs, sDivs) {
		super(scene);
        this.tDivs = tDivs;
        this.sDivs = sDivs;

        this.makeSurface();
    }

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

    updateTexCoords(lengthS, lengthT){

    }
    
    display(){
        this.nurbObject.display();
    }
}