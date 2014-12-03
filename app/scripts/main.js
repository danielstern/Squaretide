var game = new Squaretide();

game.startGame({
    time: 60
});

var showInstructions = false;

var instructions = document.getElementById("instructionsButton");
instructions.addEventListener("click", function() {
	showInstructions = !showInstructions;
	document.getElementById('game').setAttribute("show-instructions",showInstructions);
})
