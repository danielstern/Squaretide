
var DrumMachine = function() {

    // function getProcessor(tone, bpm) {
    //     return function(drumTime) {
    //         // var bpm = 16;
    //         var currentBeat = drumTime % bpm;
    //         if (Math.floor(currentBeat) === 0) {
    //             if (this.queued) {
    //                 drums.play(tone, 40);
    //                 this.queued = false;
    //                 // console.log("currentbeat?",this.queued);
    //             }
    //         } else {
    //             // console.log("enabling quued");
    //             this.queued = true;
    //         }
    //     }
    // }

    function getProcessor(tone, bpm,maxHits,offset) {
        return function(drumTime) {
            var currentBeat = drumTime % bpm;
            maxHits = maxHits || 1;
            offset = offset || 0;
            var hitSpacing = bpm * 8;
            var processor = this;
            processor.timesHit = 0;

            if (Math.floor(currentBeat) === 0 + offset) {
                if (this.queued) {
                    drums.play(tone, 40);
                    processor.timesHit++;
                    if (processor.timesHit < maxHits) {
                        Jukebox.timer.setTimeout(function(){
                        console.log("double the hitz");
                            drums.play(tone);
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

    // var drumSequences = {
    //     low: [{
    //         processor: getProcessor(0, 16),
    //         queued: true
    //     },{
    //         processor: getProcessor(0, 32),
    //         queued: true
    //     },{
    //         processor: getProcessor(0, 16, 2),
    //         queued: true
    //     }],
    //     med: [{
    //         processor: getProcessor(1, 8,1,1),
    //         queued: true
    //     },{
    //         processor: getProcessor(1, 16,1),
    //         queued: true
    //     }],
    //     high: [
    //     // {
    //     //     processor: getProcessor(2, 4),
    //     //     queued: true
    //     // }, {
    //     //     processor: getProcessor(2, 8),
    //     //     queued: true
    //     // },
    //     {
    //         processor: getProcessor(2, 16),
    //         queued: true
    //     },{
    //         processor: getProcessor(2, 16,2),
    //         queued: true
    //     },{
    //         processor: getProcessor(2, 8,2),
    //         queued: true
    //     }]
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
            // drumSequences.low[Math.floor(Math.random() * drumSequences.low.length)],
            // drumSequences.high[Math.floor(Math.random() * drumSequences.high.length)],
            // drumSequences.med[Math.floor(Math.random() * drumSequences.med.length)],
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