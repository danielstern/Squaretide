function Squaretide() {

    var tileFrequency = 10;
    var timeSinceLasttile = 0;
    var ROWS = 6;
    var COLUMNS = 10;
    var score = 1;
    var gridSize = 48;
    var tilesset;
    var tickListeners = [];
    var game = this;

    function getRandomColor() {
        var colors = ["BLUE", 'RED', 'GREEN', 'GOLD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    this.onTick = function(listener){
    	tickListeners.push(listener)
    }   

    this.startGame = function() {
        tiles = new Tileset(COLUMNS, ROWS);
    }

    this.tick = function() {

        var activetiles = tiles.getMatchingTiles(function(tile) {
            return tile.selected;
        });

        if (activetiles.length > 1) {


            var tile1 = activetiles[0];
            var tile2 = activetiles[1];

            tile1.selected = false;
            tile2.selected = false;

            if (tiles.tilesAreAdjacent(tile1, tile2)) {

                tiles.switchTiles(tile1, tile2);
            }

        }

        timeSinceLasttile += 1;
        if (timeSinceLasttile >= tileFrequency) {
            addTile();
            timeSinceLasttile = 0;
        };

        var matchingSets = TileSetAnalyzer.getChains(tiles, function(originator, tile) {
        	return originator.color && originator.color === tile.color && !originator.resolved && !tile.resolved && originator.canInteract && tile.canInteract;					
        },3);

        tiles.flattenBottom();
        
        if (matchingSets[0]) {
        	// stopTimer();
	        matchingSets.forEach(function(chain){
	          chain.forEach(function(tile) {
	        	  
	        	 // tile.color = undefined;
	        	 tile.resolved = true;
	        	 tile.canInteract = false;

	        	 setTimeout(function(){
	        	 	tile.occupied = false;
	        	 },350);
	        	 // tile.x = 0;
	        	 //score += 1;
	          });
	        });


	        // setTimeout(startTimer,600);
        }


        tickListeners.forEach(function(listener){
        	listener();
        });

    }


    function addTile() {
        var columns = tiles.getAllAsColumns();

        var column = columns[Math.floor(Math.random() * columns.length)];

        var lastEmpty = TileSetAnalyzer.getLastEmptyTile(column);

        if (lastEmpty) {
            var coordinate = lastEmpty;
            coordinate.occupied = true;
            coordinate.resolved = false;
            // coordinate.initialize();
            coordinate.color = getRandomColor();
            setTimeout(function(){
            	coordinate.canInteract = true;
            })
           
        }
    }
}

var game = new Squaretide();
var timer;
game.startGame();
startTimer();

function startTimer(int){
	timer = setInterval(game.tick,int || 33);
}

function stopTimer() {
	clearInterval(timer);
}
