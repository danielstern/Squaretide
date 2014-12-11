'use strict';
/* globals soundManager, Tileset, Logic, trampoline */
function Squaretide() {

    var config = {
        longTileFrequency:20,
        ROWS:6,
        COLUMNS:6,
        numColors:8,
        duration:5000,
    };

    var state = {
        timeSinceLasttile:0,
        score:0,
        chainsSinceLastCombo:0,
        timeRemaining:0,
        level:1
    };
    
    var listeners = [];
    var timer;
    var game = this;
    var gameEndListener;

    var tiles = new Tileset(config.COLUMNS, config.ROWS, game);


    function getRandomColor() {
        return Math.floor(Math.random() * config.numColors);
    }

    function getSafeColor(tile) {
        var neighbours = tiles.getAllNeighbours(tile);
        var neighbourColors = [];
        neighbours.forEach(function(neighbour){
            neighbourColors.push(neighbour.color);
        });

        var color = 0;
        while (neighbourColors.indexOf(color) > -1) {
            color = getRandomColor();
        }

        return color;
    }

    function on(type, listener) {
        if (!listeners[type]) {
            listeners[type] = [];
        };
        listeners[type].push(listener);
        console.log("Adding listener",type,listeners[type])
    }

    function broadcast(type) {

        console.log("broadcast",type,listeners[type])

        if (listeners[type]) {
            listeners[type].forEach(function(listener){
                listener();
            })

        }
    }

    function purgeAllTiles() {
        tiles.getTiles().forEach(function(tile){
            tile.resolve();
        });
    }

    function changeColorAllTiles() {
        tiles.getMatchingTiles(function(tile){
            return tile.occupied;
        }).forEach(function(tile){
           tile.color = getSafeColor(tile);  
        });
    }


    function populateAllEmptyTiles() {
        tiles.getMatchingTiles(function(tile){
            return !tile.occupied;
        }).forEach(function(tile){
            tile.color = getSafeColor(tile); 
            tile.activate();
        });

    }

 
    // }

    function startGame() {

        state.level = 1;
        state.score = 0;
        state.timeRemaining = config.duration;
        // gameEndListener = options.gameEndListener;

        purgeAllTiles();
        populateAllEmptyTiles();
        changeColorAllTiles(); 

        startTimer();
    }

    function pauseGame() {
        stopTimer();
    }

    function resumeGame() {
        startTimer();
    }

    function endGame() {
        stopTimer();
        console.log("Broadcast end");
        broadcast('end');
    }

    function startTimer() {
        if (timer) {
            stopTimer();
        }
        timer = setInterval(game.onEnterFrame, 33);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resolveTilesInChain(chain){

        var tilesSoFar = 0;
        var baseTone = chain[0].color;

        if (chain.every(function(tile){
            return !tile.occupied;
        })) {
            return;
        }
        
        soundManager.tone(baseTone);

        function resolveTile(tile) {
            tile.resolve();
            state.score += 100;

            soundManager.tone(baseTone + tilesSoFar, 100);
            tilesSoFar++;
        }

        trampoline(chain,resolveTile,150);
    }




    function onEnterFrame() {

        state.timeRemaining-= 33;

        if (state.timeRemaining < 0) {
            endGame();
        }

        var activetiles = tiles.getMatchingTiles(function(tile) {
            return tile.selected;
        }).sort(function(a,b){
            return a.timeSelected - b.timeSelected;
        });

        if (activetiles.length > 1) {

            var tile1 = activetiles[0];
            var tile2 = activetiles[1];

            if (tiles.tilesAreAdjacent(tile1, tile2)) {

                tile1.selected = false;
                tile2.selected = false;

                // console.log("Switch tiles",tile1,tile2);

                tiles.switchTiles(tile1, tile2);

                soundManager.tone(tile1.color, 100);
                soundManager.tone(tile2.color, 100);

            } else {
                // console.log("deselect first tl")
                tile1.selected = false;
            }
        }

        var matchingSets = Logic.getChains(tiles, Logic.tileColorsMatch, 3);
 

        broadcast("tick");

        tiles.flattenBottom();
        populateAllEmptyTiles();



        if (matchingSets[0]) {
            matchingSets = matchingSets.sort(function(a,b){
                return b.length - a.length;
            });

            matchingSets.forEach(resolveTilesInChain);
        }

        document.getElementById('score').innerHTML = state.score;
        document.getElementById('time').innerHTML = Math.floor(state.timeRemaining / 1000);

    }

    this.on = on;
    this.startGame = startGame;
    this.endGame = endGame;
    this.onEnterFrame = onEnterFrame;
    this.pauseGame = pauseGame;
    this.resumeGame = resumeGame;

    /*exported tick, startGame, endGame */
}
/* exported Squaretide */