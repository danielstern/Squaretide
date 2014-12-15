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
        soundManager. scaleSequence(0,'minor');
    }

    $rootScope.startGame = function(){
        $rootScope.mode = "game";
        game.startGame();
        soundManager. scaleSequence(1);
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
        synth.play(tone + 12, 100);
    },
    scaleSequence: function(base,scale,duration,repeat) {
        base = base || 0;
        scale = scale || 'major';
        var processor = majorScale;
         if (scale === 'minor') {
            processor = minorScale;
        }
         if (scale === 'frigean') {
            processor = frigeanScale;
        }

        duration = duration || 100;
        repeat = repeat || 1;

        instructions = [];
        for (var i = 0; i < 4 * repeat; i++) {
            instructions.push({
                timeout:duration,
                callback: function(j) {
                    console.log("play note callback,",j,base);
                    soundManager.tone(processor(j,base));
                },
                arg: i
            })
        };

        console.log("instructions?",instructions);

        Jukebox.timer.setSequence(instructions);
    },
    scaleFromTwoValues:function(value1,value2) {
        var base = value1;
        var scales = ['major','minor','frigean'];
        var value2mod = value2 % scales.length;
        var scale = scales[value2mod];
        console.log("scale from 2 values...",base,scale)
        this.scaleSequence(base,scale,100);
    }
}

function majorScale(interval,base) {
    var rate = interval % 8;
    if (rate === 0) return 0 + base;
    if (rate === 1) return 4 + base;
    if (rate === 2) return 7 + base;
    if (rate === 3) return 12 + base;
    if (rate === 4) return 11 + base;
    if (rate === 5) return 10 + base;
    if (rate === 6) return 9 + base;
    if (rate === 7) return 10 + base;
    if (rate === 8) return 8 + base;
}

function minorScale(interval,base) {
    var rate = interval % 4;
    if (rate === 0) return 0 + base;
    if (rate === 1) return 3 + base;
    if (rate === 2) return 7 + base;
    if (rate === 3) return 3 + base;
}

function frigeanScale(interval,base) {
    var rate = interval % 6;
    if (rate === 0) return 0 + base;
    if (rate === 1) return 1 + base;
    if (rate === 2) return 4 + base;
    if (rate === 3) return 5 + base;
    if (rate === 4) return 10 + base;
    if (rate === 5) return 12 + base;
    if (rate === 6) return 10 + base;
}

// function fastSequence(base,tonality) {
//     console.log("Castseuence");
//     var scale = majorScale;
//     tonality = tonality || 'major';
//     if (tonality === 'minor') {
//         scale = minorScale;
//     }
//     Jukebox.timer.setSequence([{
//         timeout:100,
//         callback: function() {
//             soundManager.tone(scale(0,base));
//         }
//     },{
//         timeout:100,
//         callback: function() {
//             soundManager.tone(scale(1,base));
//         }
//     },{
//         timeout:100,
//         callback: function() {
//             soundManager.tone(scale(2,base));
//         }
//     },{
//         timeout:100,
//         callback: function() {
//             soundManager.tone(scale(1,base));
//         }
//     }])
// }
