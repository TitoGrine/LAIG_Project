/**
 * Animation Abstract class to be implemented
 * @constructor
 * @param {Animation ID} id
 * 
 */
class MyAnimator {
	constructor(scene, orchestrator, game_sequence) {
        this.scene = scene;
        this.game_orchestrator = orchestrator;
        this.game_sequence = game_sequence;
        this.animation = null;
        this.current_time = 0;
        this.span = 0;
    }

	/**
	 * Update animation fuction requires implementation
	 * @param {Current time when the function is called} time 
	 */
	update(elapsed_time){
        if(this.current_time > this.span)
            this.reset();

        if(this.animation){
            this.current_time += elapsed_time;
            this.animation.update(this.current_time);
        }
	}

	start(animation, listener){
        this.animation = animation;
        this.listener = listener;

        let moves = this.game_sequence.getLastMove().getMoves();

        //console.log(moves);

        this.span = this.animation.getSpan() * 1000;
        
        this.animation.addMoves(moves);
    }
    
	reset(){
        this.animation.apply(this.game_orchestrator.board);
        
        this.animation = null;
        this.current_time = 0;

        this.listener();
    }

    animationOver(){
        return this.animation == null;
    }

    display(){
    }
}