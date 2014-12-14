'use strict';
/* globals soundManager, Tileset, logic, trampoline, Jukebox */
function Squaretide() {

        var config = {
            chainGracePeriod: 15,
            tileResolveTime: 250
        };

        var level = {
            colors: 6,
            minimumChainLength: 3,
            rows: 3,
            columns: 3,
            duration: 105000,
            pointsPerTile: 100,
        }

        var state = {
            score: 0,
            timeRemaining: 0,
            level: 1,
            speed: 33,
            chainTimeRemaining: 0,
            currentComboCount: 0,
            currentComboMultiplier: 0,
            currentComboChain: 0,
            currentComboScore: 0,
            scoreThisLevel: 0,
            paused: true
        };

        var listeners = [],
            tiles;



        var timer = Jukebox.timer;

        function bonusMessage(message) {
            console.log(message);
        }

        function getSafeColor(tile) {

            var allSegments = logic.getAllSegments(tiles)
                .filter(function(segment) {
                    return segment.length >= level.minimumChainLength;
                })
                .filter(function(segment) {
                    return logic.tileInSegment(segment, tile);
                });

            var colors = level.colors;

            var safeColors = [];
            for (var i = 0; i < colors; i++) {
                safeColors.push(i);
            }
            var unsafeColors = [];
            allSegments.forEach(function(segment) {

                for (var i = 0; i < colors; i++) {
                    tile.color = i;
                    if (logic.sequenceIsChain(segment, logic.tileColorsMatch)) {
                        unsafeColors.push(i);
                    }
                }
            });

            var goodColors = safeColors.filter(function(color) {
                return unsafeColors.indexOf(color) === -1;
            });

            if (goodColors.length < 1) {
                throw new Error("The number of colors and the size of this field are not compatible. It is not possible to find a safe color");
            }

            return goodColors[Math.floor(Math.random() * goodColors.length)];
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
                tile.occupied = true;
                tile.color = getSafeColor(tile);
                tile.chaining = false;
            });
        }

        function nextLevel(options) {

            state.level++;

            console.info("Entering next level.");

            level = options || gameSettingsFromLevel(state.level);
            console.log("respawning tiles", level);
            tiles.respawn({
                columns: level.columns,
                rows: level.rows
            })

            state.timeRemaining = level.duration;
            state.scoreThisLevel = 0;
            changeColorAllTiles();
            populateAllEmptyTiles();

            window._numRows = level.rows;
            window._numColumns = level.columns;

            resume();
        }

        function startGame(options) {

            state.level = 1;
            state.score = 0;

            nextLevel(options);
        }

        function pause() {
            state.paused = true;
        }

        function resume() {
            state.paused = false;
            console.log("Resuming");
        }

        function endGame() {
            pause();
            broadcast('end');
        }

        function resetCombo() {
            state.currentComboScore = 0;
            state.currentComboCount = 0;
            state.currentComboMultiplier = 0;
            state.currentComboChain = 0;
        }


        function resolveCurrentCombo() {
            // console.log("Resolving combo",state.currentComboCount,state.currentComboMultiplier,state.currentComboChain);
            // console.log("BASE SCORE! ", state.currentComboScore);
            // console.log("TOTAL TILES! ", state.currentComboCount);

            if (state.currentComboMultiplier > 1) {
                // console.log("COMBO! ", state.currentComboMultiplier);
            }
            if (state.currentComboChain > 1) {
                // console.log("CHAIN! ", state.currentComboChain);
            }
            var totalComboScore = state.currentComboScore *= state.currentComboChain;
            // var totalComboScore = state.currentComboScore *= state.currentComboMultiplier *= state.currentComboChain;
            // console.log("TOTAL COMBO SCORE!", totalComboScore);
            state.score += totalComboScore;
            state.scoreThisLevel += totalComboScore;
            resetCombo();
        }


        function resolveTile(tile) {
            // console.log("Resolvign tiles")

            tile.occupied = false;
            state.currentComboCount += 1;
            var tileScore = level.pointsPerTile * state.currentComboCount;
            // var tileScore = 100 * state.currentComboMultiplier * state.currentComboCount;
            // console.log("TILE POINTS!:", tileScore);
            state.currentComboScore += tileScore;
            state.chainTimeRemaining = config.chainGracePeriod;
        }

        function resolveChain(tiles) {

            state.currentComboMultiplier += 1;

            var baseTone = tiles[0].color;

            if (!tiles.every(logic.getOccupied)) {
                return;
            }
            // console.log("Resolve chain...",tiles);

            tiles.forEach(function(tile) {
                tile.chaining = true;
            });
            soundManager.tone(baseTone);

            timer.setTimeout(function(){
                trampoline(tiles, resolveTile, config.tileResolveTime);
            },1000);

        }


        function resolveChains(chains) {

            pause();

            state.currentComboChain += 1;

            function getTotalTimeToResolveChain(chain) {
                if (!chain.every(logic.getOccupied)) {
                    return 0;
                }
                var totalResolveTime = chain.length * config.tileResolveTime;
                return totalResolveTime;
            }

            // trampoline(chains, resolveChain, getTotalTimeToResolveChain, resume);
            trampoline(chains, resolveChain, 1000, resume);

        }


        function findAndResolveMatches() {
            var chains = logic.getChains(tiles, logic.tileColorsMatch, level.minimumChainLength);
            if (chains.length > 0) {
                resolveChains(chains);
            }
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

                    pause();

                    tile1.selected = false;
                    tile2.selected = false;

                    tiles.switchTiles(tile1, tile2);

                    soundManager.tone(tile1.color, 100);
                    soundManager.tone(tile2.color, 100);

                    timer.setTimeout(resume, 100);

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
                // endGame();
                if (state.scoreThisLevel >= level.targetScore) {
                    nextLevel();
                } else {
                    endGame();
                }
            }


            tiles.flattenBottom();

            if (state.chainTimeRemaining >= 0) {
                state.chainTimeRemaining -= 1;
            } else {
                if (state.currentComboCount > 0) {
                    resolveCurrentCombo();
                    populateAllEmptyTiles();
                }
            }

            broadcast('tick');

        }

        function init() {
            Jukebox.timer.setInterval(onEnterFrame, 1000 / state.speed);

            tiles = new Tileset({
                columns: config.COLUMNS,
                rows: config.ROWS
            });

            on('tick', findAndResolveMatches);
            on('tick', findAndSwitchActiveTiles);

        }

        init();

        this.on = on;
        this.startGame = startGame;
        this.state = state;
        this.config = config;
        this.tiles = tiles;
        this.getSafeColor = getSafeColor;

        /*exported tick, startGame, endGame */
    }
    /* exported Squaretide */
