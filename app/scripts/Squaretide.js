'use strict';
/* globals soundManager, Tileset, TileSetAnalyzer, trampoline */
function Squaretide() {

    var config = {
        longTileFrequency:20,
        ROWS:6,
        COLUMNS:6,
        numColors:8,
        duration:30000,
    };

    var state = {
        timeSinceLasttile:0,
        score:0,
        chainsSinceLastCombo:0,
        timeRemaining:0,
        level:1
    };
    
    var tickListeners = [];
    var timer;
    var game = this;
    var gameEndListener;
    var tiles;


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

    function onTick(listener) {
        tickListeners.push(listener);
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

    function startGame(options) {

        options = options || {};

       tiles = tiles || new Tileset(config.COLUMNS, config.ROWS, game);
        // level = 1;
        state.timeRemaining = (options.time || config.duration) * 1000;
        gameEndListener = options.gameEndListener;

        purgeAllTiles();
        populateAllEmptyTiles();
        changeColorAllTiles(); 

        state.score = 0;
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
        if (gameEndListener) {
            gameEndListener({
                score:state.score
            });
        }
    }

    function startTimer(int) {
        if (timer) {
            stopTimer();
        }
        timer = setInterval(game.tick, int || 33);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resolveTilesInChain(chain){

        state.chainsSoFar++;
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



    function tick() {

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
                state.timeSinceLasttile -= state.longTileFrequency;
                tile1.suspend(350);
                tile2.suspend(350);
                tiles.switchTiles(tile1, tile2);
                soundManager.tone(tile1.color, 100);
                soundManager.tone(tile2.color, 100);
                state.chainsSinceLastCombo = 0;
            } else {
                tile1.selected = false;
            }



        }

        var matchingSets = TileSetAnalyzer.getChains(tiles, function(tile1, tile2) {
            return tile1.color !== undefined && 
            tile1.color === tile2.color && 
            tile1.occupied && 
            tile2.occupied &&
            tile1.canInteract && 
            tile2.canInteract;
        }, 3);


      

        tickListeners.forEach(function(listener) {
            listener();
        });

        // this is the most amazing hack.
        tiles.flattenBottom();

        populateAllEmptyTiles();



        if (matchingSets[0]) {
            matchingSets = matchingSets.sort(function(a,b){
                return b.length - a.length;
            });
            state.chainsSinceLastCombo += 1;
            var delay = 150;

            trampoline(matchingSets,resolveTilesInChain,150);
        }

        document.getElementById('score').innerHTML = state.score;
        document.getElementById('time').innerHTML = Math.floor(state.timeRemaining / 1000);

    }

    this.onTick = onTick;
    this.startGame = startGame;
    this.endGame = endGame;
    this.tick = tick;
    this.pauseGame = pauseGame;
    this.resumeGame = resumeGame;

    /*exported tick, startGame, endGame */
}
/* exported Squaretide */