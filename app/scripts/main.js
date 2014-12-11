var synth = Jukebox.getSynth(JBSCHEMA.synthesizers['Duke Straight Up']);

var game = new Squaretide();



var showInstructions = false;

var soundManager = {
    tone: function(tone, duration) {
        synth.play(tone * 4 + 12, 100);
    }
}

var instructions = document.getElementById("instructionsButton");
var start = document.getElementById("startButton");
instructions.addEventListener("click", function() {
    showInstructions = !showInstructions;
    document.getElementById('game').setAttribute("show-instructions", showInstructions);
    soundManager.tone(0, 200);

})

start.addEventListener("click", function() {
    soundManager.tone(1, 200);
    document.getElementById('game').setAttribute("show-menu", false);
    game.startGame();
    game.on("end", function() {
        document.getElementById('game').setAttribute("show-instructions", false);
        document.getElementById('game').setAttribute("show-menu", true);
    })
})

game.startGame();
setTimeout(function() {
    // game.pauseGame();
}, 100);
