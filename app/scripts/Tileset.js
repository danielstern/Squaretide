
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
	div1.appendChild(div2);// append to div

	var tile;
	var visualizer = this;
	var finished = false;

	div2.addEventListener("click",onClick);

	 function onTick() {
	 	if (finished) {
	 		return;
	 	}
		div2.setAttribute("x", tile.x); 
		div2.setAttribute("y", tile.y); 
		div2.setAttribute("color",tile.color);
		div2.setAttribute("selected",tile.selected);
		div2.setAttribute("resolved",tile.resolved);

		if (tile.resolved) {
			// div1.removeChild(div2);
			// finished = true;
		}
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
    for (var i = 0; i < columns; i++) {
        for (var k = 0; k < rows; k++) {
            var tile = new Tile();
            tile.x = i;
            tile.y = k;
            if (adjuster != null) {
                adjuster(tile);
            };

            var square = new TileVisualizer();
            game.onTick(square.onTick);
            // playfield.addChild(square);
            square.attachToTile(tile);

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
        }).sort(function(a, b) {
            return a.x - b.x;
        });
    }

    function flattenBottom() {
    	var columns = getAllAsColumns();
    	columns.forEach(function(column){
    		for (var i = column.length; i > 0;i--) {
    			var tile = column[i - 1];
    			if (!tile.occupied) {
    				for (var k = i; k > 0; k--) {
    					var tile2 = column[k-1];
    					if (tile2.occupied) {
    						switchTiles(tile, tile2);
    						break;
    					}
    				}
    			}
    		}
    	})
    }


    function getAllAsColumns() {
        var allColumns = [];
        for (var i = 0; i < numColumns; i++) {
            allColumns.push(getColumn(i));
        }
        return allColumns;
    }
    function getAllAsRows() {
    	var allRows = [];
    	for (var i = 0; i < numRows; i++) {
    		allRows.push(getRow(i));				
    	}	
    	return allRows;
    }


    function getMatchingTiles(matcher) {
        return tiles.filter(matcher);
    }


    function getTileAtCoordinates(x, y) {
        return tiles.filter(function(tile) {
            return tile.x == x && tile.y == y;
        })[0];
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
    	getAllAsRows:getAllAsRows,
    	flattenBottom:flattenBottom,
    }
}
