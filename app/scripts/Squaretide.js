'use strict';
/* globals soundManager, Tileset, Logic, trampoline */
function Squaretide() {

    var config = {
        longTileFrequency:20,
        ROWS:6,
        COLUMNS:6,
        numColors:8,
        duration:15000,
    };

    var state = {
        timeSinceLasttile:0,
        score:0,
        chainsSinceLastCombo:0,
        timeRemaining:0,
        level:1,
        paused: true
    };
    
    var listeners = [];
    // var timer;
    var game = this;

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
        }
        listeners[type].push(listener);
    }

    function broadcast(type) {

        // console.log("Broadcast",type,state);
        if (listeners[type]) {
            listeners[type].forEach(function(listener){
                listener(state);
            });

        }
    }

    function purgeAllTiles() {
        tiles.getTiles().forEach(function(tile){
            tile.resolve();
        });
    }

    function changeColorAllTiles() {
        tiles.getTiles(function(tile){
            return tile.occupied;
        }).forEach(function(tile){
           tile.color = getSafeColor(tile);  
        });
    }


    function populateAllEmptyTiles() {
        tiles.getTiles(function(tile){
            return !tile.occupied;
        }).forEach(function(tile){
            tile.color = getSafeColor(tile); 
            tile.activate();
        });

    }

    function startGame() {

        state.level = 1;
        state.score = 0;
        state.timeRemaining = config.duration;

        purgeAllTiles();
        populateAllEmptyTiles();
        changeColorAllTiles(); 

        resume();
    }

    function pause() {
        state.paused = true;
    }

    function resume() {
        state.paused = false;
    }

    function endGame() {
        pause();
        broadcast('end');
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

    function findAndResolveMatches(state){
        var matchingSets = Logic.getChains(tiles, Logic.tileColorsMatch, 3);

        if (matchingSets[0]) {
            matchingSets = matchingSets.sort(function(a,b){
                return b.length - a.length;
            });

            matchingSets.forEach(resolveTilesInChain);
        }
    }


    function onEnterFrame() {

        if (state.paused) {
            return;
        }

        state.timeRemaining-= 33;

        if (state.timeRemaining < 0) {
            endGame();
        }

        var activetiles = tiles.getTiles(function(tile) {
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

                tiles.switchTiles(tile1, tile2);

                soundManager.tone(tile1.color, 100);
                soundManager.tone(tile2.color, 100);

            } else {
                tile1.selected = false;
            }
        }

      

        tiles.flattenBottom();
        populateAllEmptyTiles();
   
        broadcast('tick');

    }

    function init() {
        Jukebox.timer.setInterval(onEnterFrame, 33);
        on("tick",findAndResolveMatches);
    }

    init();

    this.on = on;
    this.startGame = startGame;

    /*exported tick, startGame, endGame */
}
/* exported Squaretide */