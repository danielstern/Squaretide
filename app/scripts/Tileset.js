/* Comprises an array of tiles with a number of members equal to row times
column. contains functions that modify the tiles. */

function Tileset(config) {

    var tiles = [];

    var numColumns = config.columns;
    var numRows = config.rows;
    for (var i = 0; i < numColumns; i++) {
        for (var k = 0; k < numRows; k++) {
            var tile = {};
            tile.x = i;
            tile.y = k;

            var square = new TileVisualizer(tile);
            tiles.push(tile);
        }
    };

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

    function flattenBottom() {
        getColumns().forEach(function(column,index){
            while(logic.arrayHasEmptyTileAfterFullTile(column)) {
                compressColumn(column);
                column = getColumn(index);
            }
        })
    }


    function switchTiles(tile1, tile2) {
        var diff = logic.getTileDiff(tile1, tile2);
        tile1.x -= diff.x;
        tile1.y -= diff.y;

        tile2.x += diff.x;
        tile2.y += diff.y;
    }

    function getTileAtCoordinates(options) {
        return tiles.filter(function(tile) {
            return tile.x == options.x && tile.y == options.y;
        })[0];
    }

    function getRow(index) {
        return tiles.filter(function(tile) {
            return tile.y == index;
        }).sort(function(a, b) {
            return a.x - b.x;
        });
    }

    function getRows() {
        var allRows = [];
        for (var i = 0; i < numRows; i++) {
            allRows.push(getRow(i));                
        }   
        return allRows;
    }

    function getColumn(index) {
        return tiles.filter(function(tile) {
            return tile.x == index;
        }).sort(function(a, b) {
            return a.y - b.y;
        });
    }

    function getColumns() {
        var allColumns = [];
        for (var i = 0; i < numColumns; i++) {
            allColumns.push(getColumn(i));
        }
        return allColumns;
    }

    function getDiagonalLR(index) {
        return tiles.filter(function(tile) {
            return tile.x - tile.y == index;
        }).sort(function(a, b) {
            return a.x - b.x;
        });
    }


    function getTiles(matcher) {
        if (matcher) {
            return tiles.filter(matcher);
        } else {
            return tiles;
        }
    }

    
    function getDiagonalRL(index) {
        return tiles.filter(function(tile) {
            return tile.y + tile.x == index;
        }).sort(function(a, b) {
            return a.y - b.y;
        });
    }
    function getDiagonals() {
        var allDiagonals = [];

        for (var i = -numColumns; i <= numColumns * 2; i++) {
            allDiagonals.push(getDiagonalLR(i));
            allDiagonals.push(getDiagonalRL(i));
        }

        return allDiagonals.filter(function(array){
            return array.length > 0;
        });
    }

    function getAllNeighbours(tile) {
        return [
            getTileAtCoordinates({x:tile.x,y:tile.y+1  }),
            getTileAtCoordinates({x:tile.x,y:tile.y-1  }),
            getTileAtCoordinates({x:tile.x+1,y:tile.y  }),
            getTileAtCoordinates({x:tile.x-1,y:tile.y  }),
            getTileAtCoordinates({x:tile.x-1,y:tile.y-1}),
            getTileAtCoordinates({x:tile.x+1,y:tile.y-1}),
            getTileAtCoordinates({x:tile.x+1,y:tile.y+1}),
            getTileAtCoordinates({x:tile.x-1,y:tile.y+1}),
        ].filter(function(tile){
            return tile;
        });
    }


    return {
        
        numRows:numRows,
        numColumns:numColumns,
        getRows:getRows,
        getRow:getRow,
        getColumns:getColumns,
        getDiagonalLR:getDiagonalLR,
        getDiagonalRL:getDiagonalRL,
        getDiagonals:getDiagonals,
        getAllNeighbours:getAllNeighbours,
        getTiles:getTiles,
        flattenBottom:flattenBottom,
        switchTiles:switchTiles,
    }
}
