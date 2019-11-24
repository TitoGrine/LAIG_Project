/**
 * MyPatch
 * @constructor
 * @param {Reference to MyScene object} scene
 * @param {Patch ID} id 
 * @param {Degree of the curve in the U domain} uDegree 
 * @param {Degree of the curve in the V domain} vDegree 
 * @param {Number of divisions in the U domain} tDivs 
 * @param {Number of divisions in the V domain} sDivs 
 */
class MyPatch extends CGFobject {
	constructor(scene, id, uDegree, vDegree, tDivs, sDivs, control_points) {
        super(scene);
		this.id = id;
        this.uDegree = uDegree;
        this.vDegree = vDegree;
        this.tDivs = tDivs;
        this.sDivs = sDivs;
        this.control_points = [];
        this.points = [];

        if(control_points.length == (uDegree + 1) * (vDegree + 1)){

            for(var i = 0; i < control_points.length; i++){
                this.points.push(control_points[i]);
            }

            this.buildCPVector();
            this.makeSurface();
        }
    }

    /**
     * Builds the control points array from the one given.
     * The given array only contains an array of all control
     * points coordinates. This function will take those coordinates
     * and arrange them in the necessary U and V divisions, in order
     * to be accepted by CGFnurbsSurface.
     */
    buildCPVector(){
        for(var u = 0; u <= this.uDegree; u++){
            var uVector = [];
            for(var v = 0; v <= this.vDegree; v++){
                uVector.push(this.points[(u * (this.vDegree + 1)) + v]);
            }
            this.control_points.push(uVector);
        }
    }

    /**
     * Creates the NURB surface corresponding to the control points
     * given. It then creates a NURB Object using that surface,
     * with the given divisions in the U and V domain.
     */
    makeSurface(){
        var nurbsSurface = new CGFnurbsSurface(this.uDegree, // degree U: to control vertexes on U
                                               this.vDegree, // degree V: to control vertexes on V
                                               this.control_points);

                                               
        this.nurbObject = new CGFnurbsObject(this.scene, this.tDivs, this.sDivs, nurbsSurface);
    }

    // Doesn nothing: Texture coordinates of NURB objects can't be changed
    updateTexCoords(lengthS, lengthT){
        
    }
    
    display(){
        this.nurbObject.display();
    }
}