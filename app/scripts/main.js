angular.module("SquaretideContainer",[])
.run(function($rootScope){
    
    var game = new Squaretide();
    var state = game.state;

    $rootScope.mode = "main-menu";
    $rootScope.showInstructions = false;
    $rootScope.game = game;
    $rootScope.state = state;
    $rootScope.difficultySymbols = [];

    $rootScope.$watch('state.time');

    $rootScope.showInstructions = function() {
        $rootScope.instructionsMaximized = !$rootScope.instructionsMaximized;
    }

    $rootScope.startGame = function(){
        $rootScope.mode = "game";
        game.startGame();
        fastSequence();
    }

    game.on("end", function() {
        $rootScope.mode = "post-level";
        $rootScope.victory = false;
    })

    $rootScope.nextLevel = function() {
        $rootScope.mode = "game";
        game.nextLevel();
    }

    $rootScope.mainMenu = function() {
        $rootScope.mode = "main-menu";
    }

    game.startGame();
    game.pause();


    game.on("level", function() {
        var level = game.getLevel();
        $rootScope.level = level;
        $rootScope.difficultySymbols.length = level.minimumChainLength;
    })

    game.on("level.complete",function(){
        // game.pause();
        $rootScope.mode = "post-level";
        $rootScope.victory = true;
    })


    game.on("score.tile", function() {

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
        if (comboScore > 35000) message = 'Killing Spree!!!'
        if (comboScore > 40000) message = 'Wicked Sick!!!'
        if (comboScore > 50000) message = 'GODLIKE!!!!';

        $rootScope.message = message;

        $rootScope.$apply();

    });

    game.on("tick",function(){
        $rootScope.$apply();
    });


})
var synth = Jukebox.getSynth(JBSCHEMA.synthesizers['Duke Straight Up']);
var soundManager = {
    tone: function(tone, duration) {
        synth.play(tone * 4 + 12, 100);
    }
}

function majorScale(interval) {
    var rate = interval % 4;
    if (rate === 0) return 0;
    if (rate === 1) return 5;
    if (rate === 2) return 8;
    if (rate === 3) return 11;
}

function fastSequence(notes) {
    console.log("Castseuence");
    Jukebox.timer.setSequence([{
        timeout:100,
        callback: function() {
            console.log("nex forst invoc")
            soundManager.tone(majorScale(0));

        }
    },{
        timeout:100,
        callback: function() {
            console.log("nex seq invoc")
            soundManager.tone(majorScale(1));
        }
    },{
        timeout:100,
        callback: function() {
            soundManager.tone(majorScale(2));
        }
    }])
}
