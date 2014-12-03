var game = new Squaretide();



var showInstructions = false;

var instructions = document.getElementById("instructionsButton");
var start = document.getElementById("startButton");
instructions.addEventListener("click", function() {
	showInstructions = !showInstructions;
	document.getElementById('game').setAttribute("show-instructions",showInstructions);
	
})

start.addEventListener("click", function() {
	// showInstructions = !showInstructions;
	document.getElementById('game').setAttribute("show-menu",false);  		
	game.startGame({
	// game.startGameFlair({
    	time: 60,
    	// time: 5,
    	gameEndListener:function(){
    		console.log("game ended");
  			document.getElementById('game').setAttribute("show-instructions",false);  		
  			document.getElementById('game').setAttribute("show-menu",true);  		
    	}
	});
})

// game.startGame();
// setTimeout(function(){
// 	// game.pauseGame();
// },2000);