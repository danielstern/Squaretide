console.log('\'Allo \'Allo!');

var TileSetAnalyzer = {
	getLastEmptyTile: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (!tile.occupied) {
				return tile;
			}
		}
	}		
}

function Tile() {
	var x;
	var y;
	var o;
	var s;
	var c;
}

function TileVisualizer() {

	var div1=document.getElementById('gamefield');//get the div element
	var div2=document.createElement("square");//create a new div

	var tile;
	var visualizer = this;

	div2.addEventListener("click",onClick);

	 function onTick() {
		div2.setAttribute("x", tile.x); 
		div2.setAttribute("y", tile.y); 
		div2.setAttribute("color",tile.color);
		div2.setAttribute("selected",tile.selected);
	};
	function onClick() {
		if (tile.selected) {
			tile.selected = false;
		} else {
			tile.selected = true;
		}
	};
	function attachToTile(_tile) {
		tile = _tile;
		div1.appendChild(div2);// append to div
	}

	return {
		attachToTile:attachToTile,
		onTick:onTick
	}
}

function Tileset(columns, rows, adjuster) {

    var tiles = [];
    var numColumns;
    var numRows;

    numColumns = columns;
    numRows = rows;
    for (var i = 0; i <= columns; i++) {
        for (var k = 0; k < rows; k++) {
            var tile = new Tile();
            tile.x = i;
            tile.y = k;
            if (adjuster != null) {
                adjuster(tile);
            };

            tiles.push(tile);
        }
    };

    function getTiles() {
        return tiles;
    }


    function getColumn(index) {
        return tiles.filter(function(tile) {
            return tile.x == index;
        }).sort(function(a, b) {
            return a.y - b.y;
        });
    }


    function getRow(index) {
        return tiles.filter(function(tile) {
            return tile.y == index;
        })
    }


    function getAllAsColumns() {
        var allColumns = [];
        for (var i = 0; i < numColumns; i++) {
            allColumns.push(getColumn(i));
        }
        return allColumns;
    }


    function getMatchingTiles(matcher) {
        return tiles.filter(matcher);
    }


    function getTileAtCoordinates(x, y) {
        return tiles.filter(function(tile) {
            return tile.x == x && tile.y == y;
        })[0];
    }


    function getAllMatchingRows(matcher, minimum) {

    }

    function getTileDiff(tile1, tile2) {
        var diff = {
            x: tile1.x - tile2.x,
            y: tile1.y - tile2.y
        }
        return diff;
    }

    function switchTiles(tile1, tile2) {
        var diff = getTileDiff(tile1, tile2);
        tile1.x -= diff.x;
        tile1.y -= diff.y;

        tile2.x += diff.x;
        tile2.y += diff.y;
    }

    function tilesAreAdjacent(tile1, tile2) {
        var diff = getTileDiff(tile1, tile2);
        if (Math.abs(diff.x) + Math.abs(diff.y) == 1) {
            return true;
        };
    }

    return {
    	getMatchingTiles:getMatchingTiles,
    	getAllAsColumns:getAllAsColumns,
    	tilesAreAdjacent:tilesAreAdjacent,
    	switchTiles:switchTiles,
    }
}


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

        tickListeners.forEach(function(listener){
        	listener();
        })
    }


    function addTile() {
        var columns = tiles.getAllAsColumns();

        var column = columns[Math.floor(Math.random() * columns.length)];

        var lastEmpty = TileSetAnalyzer.getLastEmptyTile(column);

	    console.log("adding tile...");
        if (lastEmpty) {
            var coordinate = lastEmpty;
            coordinate.occupied = true;
            coordinate.color = getRandomColor();
            var square = new TileVisualizer();
            game.onTick(square.onTick);
            // playfield.addChild(square);
            square.attachToTile(lastEmpty);
        }
    }
}

var game = new Squaretide();
game.startGame();

setInterval(game.tick,33);