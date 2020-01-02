class Toggle {
    constructor(scene, material){
        this.scene = scene;
        this.material = material;

        this.default_toggle = [0.12, 0.84, 0.38];
    }

    _color_negative(color_value, index){

        let negative = 1.0 - color_value;

        return (negative == 0.0 || negative == 1.0) ? this.default_toggle[index] : negative;
    }

    _color_tone(color_value, factor){

        let tone = color_value + ((color_value) * factor);

        return (tone == 0.0 || tone == 1.0) ? color_value : tone;
    }

    _calculateToggleColor(){

        let ambient = this.material.ambient
        let diffuse = this.material.diffuse
        let specular = this.material.specular

        this.toggle_color = new CGFappearance(this.scene);
		this.toggle_color.setAmbient(this._color_negative(ambient[0], 0), this._color_negative(ambient[1], 1), this._color_negative(ambient[2], 2), 1);
		this.toggle_color.setDiffuse(this._color_negative(diffuse[0], 0), this._color_negative(diffuse[1], 1), this._color_negative(diffuse[2], 2), 1);
		this.toggle_color.setSpecular(this._color_negative(specular[0], 0), this._color_negative(specular[1], 1), this._color_negative(specular[2], 2), 1);
        this.toggle_color.setShininess(this.material.shininess);
    }

    _calculateHighlightColor(){

        let ambient = this.material.ambient
        let diffuse = this.material.diffuse
        let specular = this.material.specular

        this.highlight_color = new CGFappearance(this.scene);
		this.highlight_color.setAmbient(this._color_tone(ambient[0], 0.8), this._color_tone(ambient[1], 0.2), this._color_tone(ambient[2], 0.2), 1);
		this.highlight_color.setDiffuse(this._color_tone(diffuse[0], 0.8), this._color_tone(diffuse[1], 0.2), this._color_tone(diffuse[2], 0.2), 1);
		this.highlight_color.setSpecular(this._color_tone(specular[0], 0.8), this._color_tone(specular[1], 0.2), this._color_tone(specular[2], 0.2), 1);
        this.highlight_color.setShininess(this.material.shininess);
    }

    getToggleColor(){
        this._calculateToggleColor();

        return this.toggle_color;
    }

    getHighlightColor(){
        this._calculateHighlightColor();

        return this.highlight_color;
    }
}