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


    function populateAll() {
        tiles.getTiles().forEach(function(tile){
            tile.activate();
            

            tile.color = getSafeColor(tile);
        })
    }

    this.startGame = function(options) {


        // populateAll();

       tiles = tiles || new Tileset(COLUMNS, ROWS, game);
        // level = 1;
        timeRemaining = options.time * 1000;
        gameEndListener = options.gameEndListener;

        populateAll();
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
        });

        if (activetiles.length > 1) {

            var tile1 = activetiles[0];
            var tile2 = activetiles[1];

            tile1.selected = false;
            tile2.selected = false;

            if (tiles.tilesAreAdjacent(tile1, tile2)) {

                timeSinceLasttile -= longTileFrequency;

                tile1.suspend(350);
                tile2.suspend(350);
                tiles.switchTiles(tile1, tile2);
                chainsSinceLastCombo = 0;
            }

            timeSinceLasttile -= longTileFrequency;

        }

        timeSinceLasttile += 1;
        if (timeSinceLasttile >= tileFrequency) {
            addTile();
            timeSinceLasttile = 0;

        };

        var matchingSets = TileSetAnalyzer.getChains(tiles, function(originator, tile) {
            return originator.color && originator.color === tile.color && !originator.resolved && !tile.resolved && originator.canInteract && tile.canInteract;
        }, 3);

        tiles.flattenBottom();

        if (matchingSets[0]) {
            chainsSinceLastCombo += 1;
            var totalScoreForSets = 0;
            matchingSets.forEach(function(chain) {

                chain.forEach(function(tile) {
                    tile.resolve();
                    totalScoreForSets += 100;
                });

            });
            totalScoreForSets *= matchingSets.length;
            if (matchingSets.length > 1) {
                bonusMessage("Combo: " + matchingSets.length);
            }
            totalScoreForSets *= chainsSinceLastCombo;
            if (chainsSinceLastCombo > 1) {
                bonusMessage("Chain: " + chainsSinceLastCombo);
            }
            score += totalScoreForSets;
        }

        tickListeners.forEach(function(listener) {
            listener();

        });

        document.getElementById('score').innerHTML = score;
        document.getElementById('time').innerHTML = Math.floor(timeRemaining / 1000);

    }

    function addTile() {
        var tile = tiles.getRandomTile();

        if (!tile.occupied) {
            tile.activate();
            tile.color = getSafeColor(tile);
        }
    }


}