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
            drumMachine.on();
        }

        game.on("end", function() {
            $rootScope.mode = "post-level";
            $rootScope.victory = false;
            drumMachine.off();
        })

        $rootScope.nextLevel = function() {
            $rootScope.mode = "game";
            game.nextLevel();
            drumMachine.off();
        }

        $rootScope.mainMenu = function() {
            $rootScope.mode = "main-menu";
            drumMachine.off();
        }

        game.startGame();
        game.pause();


        game.on("level", function() {
            var level = game.getLevel();
            $rootScope.level = level;
            $rootScope.difficultySymbols.length = level.minimumChainLength;
            drumMachine.on();
        })

        game.on("level.complete", function() {
            // game.pause();
            drumMachine.off();
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

        Jukebox.timer.setInterval(drumMachine.tick, 33);
        drumMachine.off();


    })
var synth = Jukebox.getSynth(JBSCHEMA.synthesizers['Duke Straight Up']);
var soundManager = {
    tone: function(tone, duration) {
        synth.play(tone + 12, 100);
    },
    scaleSequence: function(base, scale, duration, repeat) {
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
        this.scaleSequence(base, scale, 100);
    }
}


var DrumMachine = function() {

    function getProcessor(tone, bpm) {
        return function(drumTime) {
            // var bpm = 16;
            var currentBeat = drumTime % bpm;
            if (Math.floor(currentBeat) === 0) {
                if (this.queued) {
                    drums.play(tone, 40);
                    this.queued = false;
                    // console.log("currentbeat?",this.queued);
                }
            } else {
                // console.log("enabling quued");
                this.queued = true;
            }
        }
    }

    function getDoubleProcessor(tone, bpm) {
        return function(drumTime) {
            var currentBeat = drumTime % bpm;
            var maxHits = 1;
            var hitSpacing = bpm * 8;
            var processor = this;
            processor.timesHit = 0;

            if (Math.floor(currentBeat) === 0) {
                if (this.queued) {
                    drums.play(tone, 40);
                    processor.timesHit++;
                    if (processor.timesHit <= maxHits) {
                        Jukebox.timer.setTimeout(function(){
                        console.log("double the hitz");
                            drums.play(tone, 40);
                        }, hitSpacing);
                    }
                    this.queued = false;
                }
            } else {
                // console.log("enabling quued");
                this.queued = true;
            }
        }
    }

    var drumSequences = {
        low: [{
            processor: getProcessor(1, 16),
            queued: true
        },{
            processor: getProcessor(1, 32),
            queued: true
        },{
            processor: getDoubleProcessor(1, 16),
            queued: true
        }],
        high: [{
            processor: getProcessor(3, 4),
            queued: true
        }, {
            processor: getProcessor(3, 8),
            queued: true
        },{
            processor: getProcessor(3, 16),
            queued: true
        },{
            processor: getDoubleProcessor(3, 16),
            queued: true
        }]
    }

    var drums = Jukebox.getSynth(JBSCHEMA.synthesizers['Phoster P52 Drum Unit']);
    drums.volume = 0.2;



    var bps = 120 / 120;
    var bpm = 4;
    var measuresPerChange = 128;
    var measuresSinceChange = 0;
    var time = 0;
    var enabled = true;
    var sequences = [];

    function refreshSequences() {
        sequences = [
            drumSequences.low[Math.floor(Math.random() * drumSequences.low.length)],
            drumSequences.high[Math.floor(Math.random() * drumSequences.high.length)],
        ];
    }

    refreshSequences();


    function tick() {
        if (!enabled) return;
        time++;
        var drumTime = Math.floor(time / bps);

        measuresSinceChange++;
        if (measuresSinceChange >= measuresPerChange) {
            measuresSinceChange = 0;
            refreshSequences();
        }


        sequences.forEach(function(seq) {
            seq.processor(drumTime);
        })
    };

    this.on = function() {
        enabled = true;
    }

    this.off = function() {
        enabled = false;
    }

    this.tick = tick;
}

var drumMachine = new DrumMachine();

function majorScale(interval, base) {
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

function minorScale(interval, base) {
    var rate = interval % 4;
    if (rate === 0) return 0 + base;
    if (rate === 1) return 3 + base;
    if (rate === 2) return 7 + base;
    if (rate === 3) return 3 + base;
}

function frigeanScale(interval, base) {
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
