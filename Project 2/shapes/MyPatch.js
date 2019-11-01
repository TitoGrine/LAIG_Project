/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Plane ID
 * @param tDegree - 
 * @param sDegree - 
 * @param tDivs - 
 * @param sDivs - 
 */
class MyPatch extends CGFobject {
	constructor(scene, id, uDegree, vDegree, tDivs, sDivs, control_points) {
		super(scene);
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

    buildCPVector(){
        for(var u = 0; u <= this.uDegree; u++){
            var uVector = [];
            for(var v = 0; v <= this.vDegree; v++){
                uVector.push(this.points[(u * (this.vDegree + 1)) + v]);
            }
            this.control_points.push(uVector);
        }
    }

    makeSurface(){
        var nurbsSurface = new CGFnurbsSurface(this.uDegree, // degree U: to control vertexes on U
                                               this.vDegree, // degree V: to control vertexes on V
                                               this.control_points);

		this.nurbObject = new CGFnurbsObject(this.scene, this.tDivs, this.sDivs, nurbsSurface);
    }
    
    display(){
        this.nurbObject.display();
    }
}