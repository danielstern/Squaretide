

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

    function getTiles(matcher) {
        if (matcher) {
            return tiles.filter(matcher);
        } else {
            return tiles;
        }
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

    function compressColumn(column) {
        for (var i = column.length; i > 0; i--) {
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
    }

    

    function getAllAsColumns() {
        var allColumns = [];
        for (var i = 0; i < numColumns; i++) {
            allColumns.push(getColumn(i));
        }
        return allColumns;
    }

    function flattenBottom() {
        getAllAsColumns().forEach(function(column){
            // if (Logic.columnHasGap(column)){
            while (Logic.columnHasGap(column)){
                for (var i = 7; i > 0; i--) {
                    compressColumn(column);
                    console.log("Gap?",Logic.columnHasGap(column));
                }
            }
                // for ()
                
            // }
        });
        // for (var i = 7; i > 0; i--) {
        //     var columns = getAllAsColumns();
        //     columns.forEach(function(column){
        //         for (var i = column.length; i > 0;i--) {
        //             var tile = column[i - 1];
        //             if (tile.occupied) {
        //                 for (var k = column.length; k > i; k--) {
        //                     var tile2 = column[k - 1];
        //                     if (!tile2.occupied) {
        //                         switchTiles(tile, tile2);
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //     })
        // }
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

    function getTileAtCoordinates(x, y) {
        return tiles.filter(function(tile) {
            return tile.x == x && tile.y == y;
        })[0];
    }

    function switchTiles(tile1, tile2) {
        var diff = Logic.getTileDiff(tile1, tile2);
        tile1.x -= diff.x;
        tile1.y -= diff.y;

        tile2.x += diff.x;
        tile2.y += diff.y;
    }


    return {
        getTiles:getTiles,
        switchTiles:switchTiles,
        getAllAsRows:getAllAsRows,
        flattenBottom:flattenBottom,
    	getAllAsColumns:getAllAsColumns,
        getAllNeighbours:getAllNeighbours,
    	getAllAsDiagonals:getAllAsDiagonals,
    }
}
