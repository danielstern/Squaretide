

function Tileset(columns, rows, game) {

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

            var square = new TileVisualizer();
            square.attachToTile(tile);

            tiles.push(tile);
        }
    };

    function getTiles() {
        return tiles;
    }

    function getRandomTile() {
        return tiles[Math.floor(Math.random()* tiles.length)];
    }

    function getAllNeighbours(tile) {
        return [
            getTileAtCoordinates(tile.x,tile.y+1),
            getTileAtCoordinates(tile.x,tile.y-1),
            getTileAtCoordinates(tile.x+1,tile.y),
            getTileAtCoordinates(tile.x-1,tile.y),
            getTileAtCoordinates(tile.x-1,tile.y-1),
            getTileAtCoordinates(tile.x+1,tile.y-1),
            getTileAtCoordinates(tile.x+1,tile.y+1),
            getTileAtCoordinates(tile.x-1,tile.y+1),
        ].filter(function(tile){
            return tile;
        });
    }


    function getColumn(index) {
        return tiles.filter(function(tile) {
            return tile.x == index;
        }).sort(function(a, b) {
            return a.y - b.y;
        });
    }

    function getDiagonalLR(index) {
        return tiles.filter(function(tile) {
            return tile.x - tile.y == index;
        }).sort(function(a, b) {
            return a.x - b.x;
        });
    }


    function getDiagonalRL(index) {
        return tiles.filter(function(tile) {
            // debugger;
            return tile.y + tile.x == index;
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
                if (tile.occupied) {
                    for (var k = column.length; k > i; k--) {
                        var tile2 = column[k - 1];
                        if (!tile2.occupied) {
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
    function getAllAsDiagonals() {
        // debugger;
        var allDiagonals = [];
        for (var i = 0; i < numColumns; i++) {
            allDiagonals.push(getDiagonalLR(i));
            allDiagonals.push(getDiagonalRL(i));
        }
        for (var k = 0; k < numRows; k++) {
            // debugger;

            allDiagonals.push(getDiagonalLR(-k - 1));
            allDiagonals.push(getDiagonalRL(k + numColumns));
        }
        return allDiagonals;
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
        getRandomTile:getRandomTile,
        getTiles:getTiles,
        getAllNeighbours:getAllNeighbours,
    	getAllAsDiagonals:getAllAsDiagonals,
    }
}
