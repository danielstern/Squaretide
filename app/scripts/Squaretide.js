'use strict';
/* globals soundManager, Tileset, Logic, trampoline, Jukebox */
function Squaretide() {

        var config = {
            longTileFrequency: 20,
            ROWS: 6,
            COLUMNS: 6,
            numColors: 8,
            duration: 15000,
        };


        var state = {
            timeSinceLasttile: 0,
            score: 0,
            chainsSinceLastCombo: 0,
            timeRemaining: 0,
            level: 1,
            speed: 33,
            paused: true
        };

        var listeners = [],
        tiles,
        logic;

        function getRandomColor() {
            return Math.floor(Math.random() * config.numColors);
        }

        function getSafeColor(tile) {
            var neighbours = tiles.getAllNeighbours(tile);
            var neighbourColors = [];
            neighbours.forEach(function(neighbour) {
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

            if (listeners[type]) {
                listeners[type].forEach(function(listener) {
                    listener(state);
                });

            }
        }


        function changeColorAllTiles() {
            tiles.getTiles(function(tile) {
                return tile.occupied;
            }).forEach(function(tile) {
                tile.color = getSafeColor(tile);
            });
        }


        function populateAllEmptyTiles() {
            tiles.getTiles(function(tile) {
                return !tile.occupied;
            }).forEach(function(tile) {
                tile.color = getSafeColor(tile);
                tile.occupied = true;
            });
        }

        function startGame() {

            state.level = 1;
            state.score = 0;
            state.timeRemaining = config.duration;

            changeColorAllTiles();
            resume();

            populateAllEmptyTiles();
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

        function resolveTiles(tiles) {

            var tilesSoFar = 0;
            var baseTone = tiles[0].color;

            if (tiles.every(function(tile) {
                    return !tile.occupied;
                })) {
                return;
            }

            soundManager.tone(baseTone);

            function resolveTile(tile) {

                tile.occupied = false;
                state.score += 100;

                soundManager.tone(baseTone + tilesSoFar, 100);
                tilesSoFar++;
            }

            trampoline(tiles, resolveTile, 150);
        }


        function findAndResolveMatches() {


            logic.getChains(tiles, logic.tileColorsMatch, 3)
                .forEach(resolveTiles);
        }

        function findAndSwitchActiveTiles() {
            var activetiles = tiles.getTiles(function(tile) {
                return tile.selected;
            }).sort(function(a, b) {
                return a.timeSelected - b.timeSelected;
            });

            if (activetiles.length > 1) {

                var tile1 = activetiles[0];
                var tile2 = activetiles[1];

                if (logic.tilesAreAdjacent(tile1, tile2)) {

                    tile1.selected = false;
                    tile2.selected = false;

                    tiles.switchTiles(tile1, tile2);

                    soundManager.tone(tile1.color, 100);
                    soundManager.tone(tile2.color, 100);

                } else {
                    tile1.selected = false;
                }
            }
        }


        function onEnterFrame() {

            if (state.paused) {
                return;
            }

            state.timeRemaining -= state.speed;

            if (state.timeRemaining < 0) {
                endGame();
            }


            tiles.flattenBottom();


            broadcast('tick');

        }

        function init() {
            Jukebox.timer.setInterval(onEnterFrame, 1000 / state.speed);

            tiles = new Tileset({columns:config.COLUMNS, rows:config.ROWS});
            logic = new Logic(tiles);

            on('tick', findAndResolveMatches);
            on('tick', findAndSwitchActiveTiles);

        }

        init();

        this.on = on;
        this.startGame = startGame;

        /*exported tick, startGame, endGame */
    }
    /* exported Squaretide */
