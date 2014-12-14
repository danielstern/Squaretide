var synth = Jukebox.getSynth(JBSCHEMA.synthesizers['Duke Straight Up']);

var game = new Squaretide();



var showInstructions = false;

var soundManager = {
    tone: function(tone, duration) {
        // synth.play(tone * 4 + 12, 100);
    }
}

if (document.getElementById('game')) {

    document.getElementById('game').setAttribute("mode", "main-menu");

    var instructions = document.getElementById("instructionsButton");
    var start = document.getElementById("startButton");
    instructions.addEventListener("click", function() {
        showInstructions = !showInstructions;
        document.getElementById('home').setAttribute("show-instructions", showInstructions);
        soundManager.tone(0, 200);
    });

    start.addEventListener("click", function() {
        soundManager.tone(1, 200);
        document.getElementById('game').setAttribute("mode", "game");
        game.startGame();
        game.on("end", function() {
            document.getElementById('game').setAttribute("mode", "main-menu");
        })
    });

    Jukebox.timer.setInterval(function() {
        state = game.state;
        document.getElementById('score').innerHTML = parseInt(state.scoreThisLevel, 10);

        document.getElementById('time').innerHTML = Math.floor(state.timeRemaining / 1000);

    }, 25);


    game.on("level", function() {
        var level = game.getLevel();
        var state = game.state;
        document.getElementById('target').innerHTML = Math.floor(game.getLevel().targetScore);
        document.getElementById('level').innerHTML = Math.floor(state.level);
        chainMin.innerHTML = "";
        for (var i = 0; i < game.getLevel().minimumChainLength; i++) {
            chainMin.innerHTML += "<square color=0 class=avatar></square>";
        }
    })

    function showComboElements() {
        document.getElementById('plus-display').setAttribute("hide",false);
        document.getElementById('combo-elements').setAttribute("hide",false);
        document.getElementById('messageDisplay').setAttribute("hide",false);
    }
    function hideComboElements() {
        document.getElementById('plus-display').setAttribute("hide",true);
        document.getElementById('combo-elements').setAttribute("hide",true);
        document.getElementById('messageDisplay').setAttribute("hide",true);
    }

    game.on("score.tile", function() {
        var state = game.state;
        document.getElementById('currentComboCount').innerHTML = state.currentComboCount;
        document.getElementById('currentChainCount').innerHTML = state.currentComboChain;
        document.getElementById('currentComboMultiplier').innerHTML = state.currentComboMultiplier;
        document.getElementById('comboScore').innerHTML = parseInt(state.currentComboScore);
        showComboElements();

        var comboScore = state.currentComboScore;
        var message = 'Boring';
        if (comboScore > 500) message = 'Dull'
        if (comboScore > 1000) message = 'Weak'
        if (comboScore > 1500) message = 'Soft'
        if (comboScore > 2000) message = 'Mediocre'
        if (comboScore > 3000) message = 'Not Bad'
        if (comboScore > 4000) message = 'OK'
        if (comboScore > 5000) message = 'Alright'
        if (comboScore > 6000) message = 'Cool'
        if (comboScore > 7000) message = 'Good'
        if (comboScore > 8500) message = 'Very Good'
        if (comboScore > 10000) message = 'Great!'
        if (comboScore > 12500) message = 'Awesome!'
        if (comboScore > 15000) message = 'Amazing!'
        if (comboScore > 17500) message = 'Incredible!'
        if (comboScore > 20000) message = 'Excellent!!'
        if (comboScore > 25000) message = 'Viewtiful!!'
        if (comboScore > 30000) message = 'Unbelievable!!!'
        document.getElementById('messageDisplay').innerHTML = message;
    })

    game.on("score.resolve", function(combo) {
        hideComboElements();        
        // document.getElementById('comboScore').innerHTML = parseInt(combo.totalComboScore);
    })

    game.startGame();
    game.pause();
    hideComboElements();
}
