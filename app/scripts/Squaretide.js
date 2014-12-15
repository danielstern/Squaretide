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
            gameTime: 0,
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
                // throw new Error("The number of colors and the size of this field are not compatible. It is not possible to find a safe color");
                return safeColors[Math.floor(Math.random() * safeColors.length)];
            }

            return goodColors[Math.floor(Math.random() * goodColors.length)];
        }

        function on(type, listener) {
            if (!listeners[type]) {
                listeners[type] = [];
            }
            listeners[type].push(listener);
        }

        function broadcast(type,arg) {

            if (listeners[type]) {
                listeners[type].forEach(function(listener) {
                    listener(arg);
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
                tile.selected = false;
                tile.color = getSafeColor(tile);
                tile.chaining = false;
            });
        }

        function nextLevel(options) {

            state.level++;


            level = options || gameSettingsFromLevel(state.level);
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

            broadcast("level");
            resume();
        }

        function startGame(options) {

            state.level = 0;
            state.score = 0;

            nextLevel(options);
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

        function resetCombo() {
            state.currentComboScore = 0;
            state.currentComboCount = 0;
            state.currentComboMultiplier = 0;
            state.currentComboChain = 0;
        }


        function resolveCurrentCombo() {

            var totalComboScore = state.currentComboScore *= state.currentComboChain;
            state.score += totalComboScore;
            state.scoreThisLevel += totalComboScore;

            broadcast('score.resolve',{
                totalComboScore:totalComboScore,
                currentComboChain:state.currentComboChain,
                currentComboCount:state.currentComboCount,
                currentComboMultiplier:state.currentComboMultiplier,
            });

            resetCombo();
        }


        function resolveTile(tile) {
            tile.occupied = false;
            state.currentComboCount += 1;
            var tileScore = level.pointsPerTile * state.currentComboCount;
            state.currentComboScore += tileScore;
            state.chainTimeRemaining = config.chainGracePeriod;

            broadcast('score.tile');            
        }

        function resolveChain(tiles) {

            state.currentComboMultiplier += 1;

            var baseTone = tiles[0].color;

            tiles.forEach(function(tile) {
                tile.chaining = true;
            });
            soundManager.tone(baseTone);
            
            trampoline(tiles, resolveTile, config.tileResolveTime);

            broadcast('score.chain');

        }


        function resolveChains(chains) {

            var consolidatedChains = logic.consolidateChains(chains);

            pause();

            state.currentComboChain += 1;

            function getTotalTimeToResolveChain(chain) {
                var totalResolveTime = chain.length * config.tileResolveTime + 1;
                return totalResolveTime;
            }

            trampoline(consolidatedChains, resolveChain, getTotalTimeToResolveChain, function(){
                resume();
            });
        }


        function findAndResolveMatches() {
            if (state.chainTimeRemaining < 1) {
                var chains = logic.getChains(tiles, logic.tileColorsMatch, level.minimumChainLength);
                if (chains.length > 0) {
                    resolveChains(chains);
                }
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

        function getLevel() {
            return level;
        }

        function onEnterFrame() {


            if (state.paused) {
                return;
            }

            state.gameTime++;
            state.timeRemaining -= state.speed;

            if (state.timeRemaining < 0) {
                // endGame();
                if (state.scoreThisLevel >= level.targetScore) {
                    broadcast('level.complete');
                    pause();
                    // nextLevel();
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
                    console.log("Pop empty");
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
        this.pause = pause;
        this.getLevel = getLevel;
        this.resume = resume;
        this.nextLevel = nextLevel;

        /*exported tick, startGame, endGame */
    }
    /* exported Squaretide */
