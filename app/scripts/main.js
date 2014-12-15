angular.module("SquaretideContainer", [])
    .run(function($rootScope) {

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
            soundManager.scaleSequence(0, 'minor');
        }

        $rootScope.startGame = function() {
            $rootScope.mode = "game";
            game.startGame();
            soundManager.scaleSequence(1);
            // bass.on();
        }

        game.on("end", function() {
            $rootScope.mode = "post-level";
            $rootScope.victory = false;
            soundManager.scaleSequence(2, 'frigean',100,7);
            // drumMachine.off();
        })

        $rootScope.nextLevel = function() {
            $rootScope.mode = "game";
            game.nextLevel();
            soundManager.scaleSequence(0, 'frigean');
            // drumMachine.off();
        }

        game.on("score.tile",function(){
            soundManager.scaleSequence(state.lastResolvedTileColor + majorScale(state.currentComboCount),'major',50,1)
        })

        $rootScope.mainMenu = function() {
            $rootScope.mode = "main-menu";
            soundManager.scaleSequence(2, 'frigean',100,8);

            // drumMachine.off();
        }

        game.startGame();
        game.pause();


        game.on("level", function() {
            var level = game.getLevel();
            $rootScope.level = level;
            $rootScope.difficultySymbols.length = level.minimumChainLength;
            // drumMachine.on();
        })

        game.on("level.complete", function() {
            // game.pause();
            soundManager.scaleSequence(7, 'groovy',50,12);
            // drumMachine.off();
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

        game.on("tick", function() {
            $rootScope.$apply();
        });

        Jukebox.timer.setInterval(bass.tick, 33);
        // drumMachine.off();
        bass.off();


    })
var synth = Jukebox.getSynth(JBSCHEMA.synthesizers['Duke Straight Up']);
var soundManager = {
    tone: function(tone, duration) {
        synth.play(tone + 12, 100);
    },
    scaleSequence: function(base, scale, duration, repeat) {
        base = base || 0;
        scale = scale || 'major';
        repeat = repeat || 4;
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
        for (var i = 0; i < repeat; i++) {
            instructions.push({
                timeout: duration,
                callback: function(j) {
                    soundManager.tone(processor(j, base));
                },
                arg: i
            })
        };

        Jukebox.timer.setSequence(instructions);
    },
    scaleFromTwoValues: function(value1, value2) {
        var base = value1;
        var scales = ['major', 'minor', 'frigean'];
        var value2mod = value2 % scales.length;
        var scale = scales[value2mod];
        console.log("scale from 2 values...", base, scale)
        this.scaleSequence(base, scale, 100,2);
    }
}

var BassSequencer = function() {
    var bass = Jukebox.getSynth(JBSCHEMA.synthesizers['Blenderbart Bass Unit']);
    bass.volume = 0.2;



    var bps = 60 / 32;
    var bpm = 4;
    var measuresPerChange = 128;
    var measuresSinceChange = 0;
    var time = 0;
    var enabled = true;
    var sequences = [];
    var step = 0;

    function refreshSequences() {
        sequences = [
            // drumSequences.low[Math.floor(Math.random() * drumSequences.low.length)],
            // drumSequences.high[Math.floor(Math.random() * drumSequences.high.length)],
            // drumSequences.med[Math.floor(Math.random() * drumSequences.med.length)],
        ];
    }

    refreshSequences();

    var queued = true;

    function tick() {
        if (!enabled) return;
        time++;
        var drumTime = Math.floor(time / bps);
        var beat = drumTime % bpm;
        console.log("drum time")
        if (beat === 0) {
            if (queued) {
                bass.play(bassLine(step,0),65);
                step++;
                queued = false;
            }
        } else {
            queued = true;
        }

        measuresSinceChange++;
        if (measuresSinceChange >= measuresPerChange) {
            measuresSinceChange = 0;
            refreshSequences();
        }


        // sequences.forEach(function(seq) {
        // })
    };

    this.on = function() {
        enabled = true;
    }

    this.off = function() {
        enabled = false;
    }

    this.tick = tick;
}

var bass = new BassSequencer();

// var drumMachine = new DrumMachine();

function getScale(notes){
    return function (interval, base) {
        base = base || 0;
        var max = notes.split(" ").length;
        var rate = interval % max;
        var map = {};
        for (var i = 0; i < max; i++) {
            var note = notes.split(" ")[i];
            map[i] = note;
        }

        var note = +base + +map[rate];

        console.log("retur note...",note);
        return note;
    }
}

// function majorScale(interval, base) {
//     var rate = interval % 8;
//     if (rate === 0) return 0 + base;
//     if (rate === 1) return 4 + base;
//     if (rate === 2) return 7 + base;
//     if (rate === 3) return 12 + base;
//     if (rate === 4) return 11 + base;
//     if (rate === 5) return 10 + base;
//     if (rate === 6) return 9 + base;
//     if (rate === 7) return 10 + base;
//     if (rate === 8) return 8 + base;
// }

// function minorScale(interval, base) {
//     var rate = interval % 4;
//     if (rate === 0) return 0 + base;
//     if (rate === 1) return 3 + base;
//     if (rate === 2) return 7 + base;
//     if (rate === 3) return 3 + base;
// }


// function bassLine(interval, base) {
//     var intro = "0 7 10 7 12 7 10 7 12 7 10 7 5 3 3 2"
//     var verse = "5 3 0 3 5 3 0 3 0 7 10 7 0 7 10 7"
//     var notes = intro + " " 
//                 + intro + " " 
//                 + verse + " "
//                 + verse;
//     var max = notes.split(" ").length;
//     var rate = interval % max;
//     var map = {};
//     for (var i = 0; i < max; i++) {
//         var note = notes.split(" ")[i];
//         map[i] = note;
//     }

//     return base + map[rate];
// }

var frigeanScale = getScale("0 1 4 5 7 5 4 1 0");
var minorScale = getScale("0 3 7 3");
var majorScale = getScale("0 4 7 12 16 12 7 4");
var groovy = getScale("0 7 10 7 12 7 10 7 12 7 10 7 5 3 3 2");

var scales = [majorScale,minorScale,frigeanScale,groovy];
function getRandomScale(){
    return scales[Math.floor(Math.random() * scales.length)];
}
// var intro = "0 7 10 7 12 7 10 7 12 7 10 7 5 3 3 2"
// var verse = "5 3 0 3 5 3 0 3 0 7 10 7 0 7 10 7"
// var notes = intro + " " 
            // + intro + " " 
            // + verse + " "
            // + verse;
// 
// var bassLine = getScale(notes);