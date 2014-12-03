function trampoline(array,iterator,delay,callback) {
    function bounce() {
        elem = array[0];
        iterator(elem);
        // var _delay;
        // if (typeof delay === "number") {
            // _delay = delay;
        // } else {
            // _delay = delay(elem);
        // }
        if (array[1]) {
            setTimeout(bounce, delay);
            array.shift();
        } else {
            setTimeout(callback, delay);
        }
    }

    bounce();
}

function Squaretide() {

    var tileFrequency = 1;
    var longTileFrequency = 20;
    var timeSinceLasttile = 0;
    var ROWS = 6;
    var COLUMNS = 6;
    var score = 0;
    var gridSize = 48;
    var chainsSinceLastCombo = 0;
    var tickListeners = [];
    var timer;
    var game = this;
    var level = 1;
    var timeRemaining = 0;
    var tiles;
    var colors = ["BLUE", 'RED', 'GREEN', 'GOLD',"PINK"];
    var gameEndListener;


    
    

   
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getSafeColor(tile) {
        var neighbours = tiles.getAllNeighbours(tile);
        var safeColors = colors.slice(0,colors.length);
        neighbours.forEach(function(neighbour){
            if (safeColors.indexOf(neighbour.color) != -1) {
                safeColors.splice(safeColors.indexOf(neighbour.color),1);
            }
        })

        return safeColors[Math.floor(Math.random() * safeColors.length)];
    }

    this.onTick = function(listener) {
        tickListeners.push(listener)
    }

    function purgeAllTiles() {
        tiles.getTiles().forEach(function(tile){
            tile.resolve();
        })
    }

    function changeColorAllTiles() {
        tiles.getMatchingTiles(function(tile){
            return tile.occupied;
        }).forEach(function(tile){
           tile.color = getSafeColor(tile);  
        })
    }


    function populateAllEmptyTiles() {
        tiles.getMatchingTiles(function(tile){
            return !tile.occupied;
        }).forEach(function(tile){
            tile.color = getSafeColor(tile); 
            tile.activate();
        });

        // var _tiles = tiles.getTiles().slice(0,tiles.getTiles().length);
        // var delay = 33;

        // if (reset) {
        //     _tiles.forEach(function(tile){
        //         tile.color = getSafeColor(tile);    
        //     })
        // }

        // function recursivelyPopulateTile() {
        //     var tile = _tiles[0];
        //     if (reset || !tile.occupied) {
        //         tile.color = getSafeColor(tile);    
        //         tile.activate();
        //     }

        //     if (_tiles[1]) {
        //         _tiles.shift();
        //         setTimeout(recursivelyPopulateTile,delay);
        //     }
        // }

        // recursivelyPopulateTile();
    }

    // this.startGameFlair = function(options) {
    //     var _tiles = tiles.getTiles().slice(0,tiles.getTiles().length);
    //     // purgeAllTiles();
    //     startTimer();
    //     timeSinceLasttile -= 100;
    //     function recursivelyResolveTile(cb) {
    //         var tile = _tiles[0];
    //         tile.resolve();
    //         if (_tiles[1]) {
    //             _tiles.shift();
    //             setTimeout(recursivelyResolveTile,33,cb);
    //         } else {
    //             cb();
    //         }
    //     }

    //     recursivelyResolveTile(function(){

    //         setTimeout(game.startGame,300,options);
    //     });

    // }

    this.startGame = function(options) {

        options = options || {};

       tiles = tiles || new Tileset(COLUMNS, ROWS, game);
        // level = 1;
        timeRemaining = (options.time || 60) * 1000;
        gameEndListener = options.gameEndListener;

        purgeAllTiles();
        populateAllEmptyTiles();
        changeColorAllTiles(); 

        score = 0;
        startTimer();
    }

    this.pauseGame = function() {
        stopTimer();
    }

    this.resumeGame = function() {
        startTimer();
    }

    function endGame() {
        stopTimer();
        if (gameEndListener) {
            gameEndListener({
                score:score
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


    function bonusMessage(message) {
        console.info(message);
    }


    this.tick = function() {

        timeRemaining-= 33;

        if (timeRemaining < 0) {
            endGame();
        }

        var activetiles = tiles.getMatchingTiles(function(tile) {
            return tile.selected;
        }).sort(function(a,b){
            return a.timeSelected - b.timeSelected;
        })

        if (activetiles.length > 1) {

            var tile1 = activetiles[0];
            var tile2 = activetiles[1];


            if (tiles.tilesAreAdjacent(tile1, tile2)) {

                tile1.selected = false;
                tile2.selected = false;
                timeSinceLasttile -= longTileFrequency;
                tile1.suspend(350);
                tile2.suspend(350);
                tiles.switchTiles(tile1, tile2);
                chainsSinceLastCombo = 0;
            } else {
                tile1.selected = false;
            }



        }

        var matchingSets = TileSetAnalyzer.getChains(tiles, function(originator, tile) {
            return originator.color && originator.color === tile.color && originator.occupied && tile.occupied && originator.canInteract && tile.canInteract;
        }, 3);


      

        tickListeners.forEach(function(listener) {
            listener();
        });

        // this is the most amazing hack.
        tiles.flattenBottom();
        tiles.flattenBottom();
        tiles.flattenBottom();

        populateAllEmptyTiles();



        if (matchingSets[0]) {
            matchingSets = matchingSets.sort(function(a,b){
                return a.length - b.length;
            })
            chainsSinceLastCombo += 1;
            var totalScoreForSets = 0;
            var delay = 170;
            stopTimer();
            function resolveTilesInChain(chain){

                function resolveTile(tile) {
                    tile.resolve();
                    totalScoreForSets += tile.score || 100;
                }

                trampoline(chain,resolveTile,delay);

                matchingSets = matchingSets.filter(function(chain){
                    return chain.every(function(tile){
                        return tile.occupied;
                    })
                })
            }

            trampoline(matchingSets,resolveTilesInChain,delay * 3.3,function(){

                totalScoreForSets *= matchingSets.length || 1;
                if (matchingSets.length > 1) {
                    bonusMessage("Combo: " + matchingSets.length);
                }
                totalScoreForSets *= chainsSinceLastCombo || 1;
                if (chainsSinceLastCombo > 1) {
                    bonusMessage("Chain: " + chainsSinceLastCombo);
                }
                score += totalScoreForSets;

                tiles.flattenBottom();
                tiles.flattenBottom();
                tiles.flattenBottom();

                setTimeout(function(){
                    startTimer();
            },300);

            })
        }

        document.getElementById('score').innerHTML = score;
        document.getElementById('time').innerHTML = Math.floor(timeRemaining / 1000);

    }
}