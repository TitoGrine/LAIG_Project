/**
 * Game Controller class 
 * 
 */
class MyGameController {
	constructor(scene) {
		this.prologInterface = new MyPrologInterface(8081)
		this.theme = new MySceneGraph(ficheiro, scene)
		//this.animator = new MyAnimator()
		
	}

	calculatePos([column, row]){
        return row * (this.columns + 2) + column;
    }

	managePick(mode, results){
		if (mode == false /* && some other game conditions */) {
			if (results != null && results.length > 0) {
				for (let i = 0; i < results.length; i++) {
                    let obj = results[i][0];
                    if (obj) {
						// let coords = obj[0].getCoords();
						// obj[0].toggle();
						// console.log("Picked object: " + obj + ", with coordenates " + coords);	
						// TODO: ver se mudar para ID
						let uniqueId = results[i][1] // get id
						this.OnObjectSelected(obj, uniqueId);
						// this.onObjectSelected(obj, coords);
					
                    }
                    
				}
				results.splice(0, results.length);
			}
		}
	}

	onObjectSelected(obj, id) {
		if(obj instanceof Piece) {
			// do something with id knowing it is a piece
		} else if (obj instanceof Tile) {
			// do something with id knowing it is a tile
		} else {
			// error ? 
		}
	}

	update(time){
		//this.animator.update(time)
	}

	display(){
		this.theme.display()
		//this.board.display()
		//this.animator.display()
	}
	
}
