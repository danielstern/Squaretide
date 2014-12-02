function Squaretide() {

    var tileFrequency = 12;
    var timeSinceLasttile = 0;
    var ROWS = 6;
    var COLUMNS = 10;
    var score = 0;
    var gridSize = 48;
    var tilesset;
    var chainsSinceLastCombo = 0;
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

    function bonusMessage(message){
    	console.info(message);
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

            	tile1.canInteract = false;
            	tile2.canInteract = false;
                tiles.switchTiles(tile1, tile2);

                chainsSinceLastCombo = 0;

                setTimeout(function(){
                	tile1.canInteract = true;
                	tile2.canInteract = true;
                },350);
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

	        chainsSinceLastCombo += 1;
	        var totalScoreForSets = 0;
	        matchingSets.forEach(function(chain){

	          chain.forEach(function(tile) {	        	  
	        	 tile.resolved = true;
	        	 tile.canInteract = false;

	        	 totalScoreForSets+=100;

	        	 setTimeout(function(){
	        	 	tile.occupied = false;
	        	 },350);
	          });

	        });
	        totalScoreForSets *= matchingSets.length;
	        if (matchingSets.length > 1) {
	        	bonusMessage("Combo: "+matchingSets.length);
	        }
            totalScoreForSets *= chainsSinceLastCombo;
            if (chainsSinceLastCombo > 1) {
            	bonusMessage("Chain: "+chainsSinceLastCombo);
            }
            score+= totalScoreForSets;
        }

        tickListeners.forEach(function(listener){
        	listener();
        });

        document.getElementById('score').innerHTML = score;

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
            },350)
           
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
