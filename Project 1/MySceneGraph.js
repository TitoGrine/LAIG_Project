var DEGREE_TO_RAD = Math.PI / 180;

// TODO: globals
// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
		this.log("all parsed");

		
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        //this.onXMLMinorError("To do: Parse views and create cameras.");

        var defView = this.reader.getString(viewsNode, 'default');

        var children = viewsNode.children;

        if(defView == null){
            if(children.length == 0)
                this.onXMLError("no views defined"); //TODO: Add a default view if none exist
            else{
                defView = this.reader.getString(children[0], 'id'); // TODO: See if it works.
                this.onXMLMinorError("no default view defined. Default set to first defined view.")
            }
        }

        this.views = [];
        var numViews = 0;
        var grandChildren = [];
        var nodeNames = [];

        // Any number views
        for(var i = 0; i < children.length; i++){

            // Storing view information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            // Check type of view
            if(children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unkown tag <" + children[i].nodeName + ">");
            }
            else if (children[i].nodeName == "perspective"){
                attributeNames.push(...["from", "to"]);
                attributeTypes.push(...["position", "position"]);
            }
            else {
                attributeNames.push(...["from", "to", "up"]);
                attributeTypes.push(...["position", "position", "position"]);
            }

            // Get ID of current view
            var viewID = this.reader.getString(children[i], 'id');

            if(viewID == null)
                return "no ID defined for view";

            // Checks for repeated ID's.
            if(this.views[viewID] != null)
                return "ID must be unique for each view (conflict: ID = " + viewID + ")";

            var near = this.reader.getFloat(children[i], 'near');
            if(!(near != null && !isNaN(near)))
                return "unable to parse near attribute from view of ID = " + viewID;

            var far = this.reader.getFloat(children[i], 'far');
            if(!(far != null && !isNaN(far)))
                return "unable to parse far attribute from view of ID = " + viewID;

            // Add near and far floats plus type name to view info
            global.push(...[near, far]);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;

            // Specifications for the current view

            nodeNames = [];
            for(var j = 0; j < grandChildren.length; j++){
                nodeNames.push(grandChildren[j].nodeName);
            }

            for(var j = 0; j < attributeNames.length; j++){
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if(attributeIndex != -1){
                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "view " + attributeNames[j] + "for ID = " + viewID);
                    
                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else if(children[i].nodeName == "ortho" && attributeNames[j] == "up"){
                    // Set up attribute to default (0, 1, 0) since it's optional
                    var aux = [];
                    aux.push(...[0, 1, 0]);
                    global.push(aux);
                }
                else
                    return "view " + attributeNames[j] + " undefined for ID = " + viewID;
            }

            // Gets the additional attributes for the type of view
            if(children[i].nodeName == "perspective"){
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle for the view of ID = " + viewID;

                global.push(angle);
            }
            else {
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left for the view of ID = " + viewID;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right for the view of ID = " + viewID;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top for the view of ID = " + viewID;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom for the view of ID = " + viewID;

                global.push(...[left, right, top, bottom]);
            }

            this.views[viewID] = global;
            numViews++;
        }

        // Checks if the set default view actually exists. Sets it to the first defined view if it doesn't.
        if(this.views[defView] == null){
            this.onXMLMinorError("set default view not defined. Default set to first defined view.");
            defView = this.reader.getString(children[0], 'id'); // TODO: See if it works.
        }

        if(numViews == 0)
            return "there must be at least one view defined";

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId; // TODO: Aqui não devia ser j em vez de i?? (feito pelos profs)
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight]);
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

		this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
		
		var children = texturesNode.children;

		this.textures = [];
		var numTextures = 0;

        // Any number of textures.
        for (var i = 0; i < children.length; i++){
			if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
			}
			// TODO: deve faltar aqui algo

	        // Get id of the current texture.
			var textureId = this.reader.getString(children[i], 'id');
			if (textureId == null)
				return "no ID defined for texture";
			
			// Checks for repeated IDs.
			if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
			
			// TODO: Refactos??
			var re = /(?:\.([^.]+))?$/;

			var textureFileName = this.reader.getString(children[i], 'file');
			var extension = re.exec(textureFileName)[1];

			if(extension == null || (extension != "png" && extension != "jpg"))
				return "unable to parse filename of the texture file for ID" + textureId;
			
			var provTexture = new CGFtexture(this.scene, textureFileName);
			this.textures[textureId] = provTexture;
			
			numTextures++;
		}

		// TODO: ver coisa estranha que length continua a 0, mas lights tbm e foi feita pelo sor
		if (numTextures == 0)
            return "at least one texture must be defined";
		
		this.log("Parsed Textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        var numMaterials = 0;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

			var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["emission", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["color", "color", "color", "color"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Parse material shininess
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if(!(shininess != null && !isNaN(shininess)))
                return "unable to parse shininess for the material of ID = " + materialID;

            // Add shininess to material info
			global.push(shininess);
            grandChildren = children[i].children;

            //Specifications for the current material

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if(attributeIndex != -1){
                    var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " values for ID" + materialID);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "material " + attributeNames[j] + " undefined for ID = " + materialID;
			}

			var provMaterial = new CGFappearance(this.scene);
			provMaterial.setShininess(global[0]);
			provMaterial.setEmission(...global[1]);
			provMaterial.setAmbient(...global[2]);
			provMaterial.setDiffuse(...global[3]);
			provMaterial.setSpecular(...global[4]);

            this.materials[materialID] = provMaterial;
            numMaterials++;
        }

        if(numMaterials == 0)
            return "there must be at least one material defined";

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

			//TODO: verificacao que existe pelo menos uma transformacao??
            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
						// TODO: refactor coordinates3d??
						var scaleFactors = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);                  
						if (!Array.isArray(scaleFactors))
							return scaleFactors;
						
						transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleFactors);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], 'axis'); // TODO: confirm this is the right way to get the character
                        if (axis == null)
                            return "no axis defined for rotation for the transformation of ID = " + transformationID;
                        else if (axis.length > 1 || !(axis == 'x' || axis == 'y' || axis == 'z'))
                            return  "invalid axis of rotation for the transformation of ID = " + transformationID + ". It must be a single character from the following: 'x', 'y' or 'z'."; 
                        
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotation for the transformation of ID = " + transformationID;
                        
                        angle *= DEGREE_TO_RAD; // Converts the angle to radians TODO: Necessário??
                        var rotationVec = [];
                        
                        rotationVec.push(...[('x' == axis), ('y' == axis), ('z' == axis)]);

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, rotationVec); //TODO: Confirm it works
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
			}
			else if (primitiveType == 'triangle') {
				var globalCoord = [];
				// TODO: verificar parametros entre 1, 2 e 3??
				var aux = this.parseCoordinates3DIndex(grandChildren[0], 1, "primitive coordinates for ID = " + primitiveId);
				if (!Array.isArray(aux))
					return aux;
				globalCoord.push(aux);

				aux = this.parseCoordinates3DIndex(grandChildren[0], 2, "primitive coordinates for ID = " + primitiveId);
				if (!Array.isArray(aux))
					return aux;
				globalCoord.push(aux);

				var aux = this.parseCoordinates3DIndex(grandChildren[0], 3, "primitive coordinates for ID = " + primitiveId);
				if (!Array.isArray(aux))
					return aux;
				globalCoord.push(aux);

				var triangle = new MyTriangle(this.scene, primitiveId, globalCoord[0], globalCoord[3], globalCoord[6], globalCoord[1], globalCoord[4], globalCoord[7], globalCoord[2], globalCoord[5], globalCoord[8]);
				
				this.primitives[primitiveId] = triangle;
			}
			else if (primitiveType == 'cylinder') {
				// TODO: refactor e verificações??
				 // base
				 var base = this.reader.getFloat(grandChildren[0], 'base');
				 if (!(base != null && !isNaN(base)))
					 return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
 
				 // top
				 var top = this.reader.getFloat(grandChildren[0], 'top');
				 if (!(top != null && !isNaN(top)))
					 return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
 
				 // height
				 var height = this.reader.getFloat(grandChildren[0], 'height');
				 if (!(height != null && !isNaN(height)))
					 return "unable to parse height of the primitive coordinates for ID = " + primitiveId;
 
				 // slices
				 var slices = this.reader.getFloat(grandChildren[0], 'slices');
				 if (!(slices != null && !isNaN(slices)))
					 return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
 
				 // stacks
				 var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
				 if (!(stacks != null && !isNaN(stacks)))
					 return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
				
				 var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
 
				 this.primitives[primitiveId] = cylinder;
			}
			else if (primitiveType == 'sphere') {
				// TODO: refactor e verificações??
				 // radius
				 var radius = this.reader.getFloat(grandChildren[0], 'radius');
				 if (!(radius != null && !isNaN(radius)))
					 return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;
 
				 // slices
				 var slices = this.reader.getFloat(grandChildren[0], 'slices');
				 if (!(slices != null && !isNaN(slices)))
					 return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
 
				 // stacks
				 var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
				 if (!(stacks != null && !isNaN(stacks)))
					 return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
				
				 var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);
 
				 this.primitives[primitiveId] = sphere;
			}
			else if (primitiveType == 'torus') {
				// TODO: refactor e verificações??
				 // inner
				 var inner = this.reader.getFloat(grandChildren[0], 'inner');
				 if (!(inner != null && !isNaN(inner)))
					 return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;
 
				 // outer
				 var outer = this.reader.getFloat(grandChildren[0], 'outer');
				 if (!(outer != null && !isNaN(outer)))
					 return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;
 
				 // slices
				 var slices = this.reader.getFloat(grandChildren[0], 'slices');
				 if (!(slices != null && !isNaN(slices)))
					 return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
				
				 // loops
				 var loops = this.reader.getFloat(grandChildren[0], 'loops');
				 if (!(loops != null && !isNaN(loops)))
					 return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;
				

				 var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
 
				 this.primitives[primitiveId] = torus;
			}
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";
			
			if(i == 0)
				this.idRoot = componentID;

			grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

			// TODO: verificar que só há estes 4??
            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");
			const component = {};

			// Transformations
			if (transformationIndex == -1)
				return "tag <transformation> missing in the component with ID " + componentID;
			
			grandgrandChildren = grandChildren[transformationIndex].children;
			var explicitTransf = false;
			//TODO: refactor com parseTransformation
			var transfMatrix = mat4.create();
			//Parse transformations block
			for(var j = 0; j < grandgrandChildren.length; j++){ 
				if(grandgrandChildren[j].nodeName == "transformationref"){
					if(explicitTransf){
						this.onXMLMinorError("explicit transformation found for component " + componentID + " ignored ref");
						continue;
					}

					var transformationID = this.reader.getString(grandgrandChildren[j], 'id');
					if (transformationID == null)
						return "no ID defined for transformation for component " + componentID;
					
					if(this.transformations[transformationID] == null)
						return "there is no transformation with ID " + transformationID;
					
					if(grandgrandChildren.length > 1)
						this.onXMLMinorError("there should be only one transformation ref or an explicit one. ignorig the rest for the component " + componentID);

					
					component.transformation = this.transformations[transformationID];
					break;
				}

				// TODO: n está muito bonito aqui
				explicitTransf = true;
				switch (grandgrandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for the component ID " + componentID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
						// TODO: refactor coordinates3d??
						var scaleFactors = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for the component ID " + componentID);                  
						if (!Array.isArray(scaleFactors))
							return scaleFactors;
						
						transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleFactors);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], 'axis'); // TODO: confirm this is the right way to get the character
                        if (axis == null)
                            return "no axis defined for rotation for the transformation of the component of ID = " + componentID;
                        else if (axis.length > 1 || !(axis == 'x' || axis == 'y' || axis == 'z'))
                            return  "invalid axis of rotation for the transformation of the component of ID = " + componentID + ". It must be a single character from the following: 'x', 'y' or 'z'."; 
                        
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotation for the transformation of the component of ID = " + componentID;
                        
                        angle *= DEGREE_TO_RAD; // Converts the angle to radians TODO: Necessário??
                        var rotationVec = [];
                        
                        rotationVec.push(...[('x' == axis), ('y' == axis), ('z' == axis)]);

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, rotationVec); //TODO: Confirm it works
                        
                        break;
				}
			}
			// TODO: verificar também se não houve nada??
			if(explicitTransf)
				component.transformation = transfMatrix;
			this.log("Parsed Component - transformation");

			// Materials
            if(materialsIndex == -1)
                return "tag <material> missing in the component with ID = " + componentID;

            var numMaterials = 0;
            var materials = [];

            grandgrandChildren = grandChildren[materialsIndex].children;

            //Parse materials block
			for(var j = 0; j < grandgrandChildren.length; j++){
                var materialID = this.reader.getString(grandgrandChildren[j], 'id');

                if(materialID == null)
                    return "no ID defined for the material of the component with ID = " + componentID;

                if(this.materials[materialID] == null && materialID != "inherit")
                    return "there is no material with ID = " + materialID + " used in component with ID = " + componentID;
				
				// TODO: ver isto
				if(this.materials[materialID] != null)
					materials.push(this.materials[materialID]);
				else
					materials.push(materialID);
				
				numMaterials++;
            }

            if(numMaterials == 0)
                return "no valid materials defined for the component of ID = " + componentID;

            component.materials = materials;

                // Texture
			this.onXMLMinorError("To do: Parse components - Texture.");
			if (textureIndex == -1)
				return "tag <texture> missing in the component with ID " + componentID;
			
			var textureID = this.reader.getString(grandChildren[textureIndex], 'id'); 
			if (textureID == null)
				return "no ID defined for texture for component " + componentID;
			
			if(this.textures[textureID] == null && textureID != "inherit" && textureID != "none")
				return "there is no texture with ID " + textureID;
			// TODO: ver isto
			if(this.textures[textureID] != null)
				textureID = this.textures[textureID];
			
			var length_s, length_t;
			// TODO: tem de ter length_s e length_t?? 
			if(this.reader.hasAttribute(grandChildren[j], "length_s") && this.reader.hasAttribute(grandChildren[j], "length_t")){
				length_s = this.reader.getFloat(grandChildren[j], "length_s");
				if (!(length_s != null && !isNaN(length_s)))
					return "unable to parse length_s of the component " + componentID;
				
				length_t = this.reader.getFloat(grandChildren[j], "length_t");
				if (!(length_t != null && !isNaN(length_t)))
					return "unable to parse length_t of the component " + componentID;
			}
			component.texture = { textureID, length_s, length_t };

			// Children
			if(childrenIndex == -1)
                return "tag <children> missing in the component with ID = " + componentID;

            var numChildren = 0;
            var children = [];

            grandgrandChildren = grandChildren[childrenIndex].children;

            //Parse children block
			for(var j = 0; j < grandgrandChildren.length; j++){
                var childrenID = this.reader.getString(grandgrandChildren[j], 'id');

                if(childrenID == null)
                    return "no ID defined for the child of the component with ID = " + componentID;

                switch(grandgrandChildren[j].nodeName){
                    case 'componentref':
                        var componentRefID = this.reader.getString(grandgrandChildren[j], 'id');

                        if(this.components[componentRefID] == null)
                            return "there is no component with ID = " + componentRefID + " that can be a child of the component with ID = " + componentID; // TODO: Check if this is true

                        numChildren++; // Valid child

                        children.push(this.components[componentRefID]);
						
						break;
                    case 'primitiveref':
                        var primitiveRefID = this.reader.getString(grandgrandChildren[j], 'id');

                        if(this.primitives[primitiveRefID] == null)
                            return "there is no primitive with ID = " + primitiveRefID + ". Used as a child of the component with ID = " + componentID; // TODO: Check if this is true

                        numChildren++; // Valid child

                    	children.push(this.primitives[primitiveRefID]);

                        break;
                }
                
                if(numChildren == 0)
                    return "no valid children defined for the component of ID = " + componentID;

				component.children = children;
			}
		
			this.components[componentID] = new Component(this.scene, component);
		}
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

	/**
	 * TODO:refactor
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
	 * @param {index of the coordinates} index
     */
    parseCoordinates3DIndex(node, index, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x' + index);
        if (!(x != null && !isNaN(x)))
            return "unable to parse x" + index + "-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y' + index);
        if (!(y != null && !isNaN(y)))
            return "unable to parse y" + index + "-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z' + index);
        if (!(z != null && !isNaN(z)))
            return "unable to parse z" + index + "-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
	}
	
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
	}

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

	nextMaterial(){
		this.components[this.idRoot].nextMaterial();
	}

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph
		
        //To test the parsing/creation of the primitives, call the display function directly
		// let rootComp = new Component(this.scene, this.components['demoRectangle']); 

		//TODO: provisório
		this.components[this.idRoot].display();
		// this.comp.display();
		// this.primitives['demoRectangle'].display();
    }
}