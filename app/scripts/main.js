var jukebox = new Jukebox();

var synth = new jukebox.Synth();
var synth2 = new jukebox.Synth();

var drums = new jukebox.Drums();

var game = new Squaretide();

var toneFrequencies = [
	// 261.63,
	// 293.66,
	220,
	349.23, // f
	//392,
	440,  //a
	//493.88, //b
	523.25, // c
	//587.33, //d
	659.25, //e
	698.46, //f
]

var musicIntervals = [
	// 9/8,
	// 81/64,
	4/3,
	3/2,
	// 27/16,
	2,
	3.5,
	// 4,
]

var colors = ["BLUE", 'RED', 'GREEN', 'GOLD',"PINK","ORANGE"];


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

game.startGame();
setTimeout(function(){
	// game.pauseGame();
},100);