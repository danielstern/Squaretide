/* contains operations that do not modify the array of tiles. */
var Logic = function(tiles) {

    // function getLastEmptyTile(col) {
    //     for (var i = col.length - 1; i >= 0; i--) {
    //         var tile = col[i];
    //         if (!tile.occupied) {
    //             return tile;
    //         }
    //     }
    // };

    // function getLastFullTile(col) {
    //     for (var i = col.length - 1; i >= 0; i--) {
    //         var tile = col[i];
    //         if (tile.occupied) {
    //             return tile;
    //         }
    //     }
    // };

    function getLastEmptyIndex(col) {
        for (var i = col.length - 1; i >= 0; i--) {
            var tile = col[i];
            if (!tile.occupied) {
                return i;
            }
        }
    };

    function getLastFullIndex(col) {
        for (var i = col.length - 1; i >= 0; i--) {
            var tile = col[i];
            if (tile.occupied) {
                return i;
            }
        }
    };

    function columnHasGap(col) {
            var map = col.map(function(tile) {
                return tile.occupied;
            });
            // console.log("Found empty tile at index:",this.getLastEmptyIndex(col),this.getLastFullIndex(col));
            // if (this.getLastFullIndex(col) > this.getLastEmptyIndex(col)) {
            if (map.indexOf(false) > map.indexOf(true)) {

                return true;
            }
        };

     function tilesAreAdjacent(tile1, tile2){
     	var diff = getTileDiff(tile1, tile2);
     	if (Math.abs(diff.x) + Math.abs(diff.y) == 1) {
     	    return true;
     	};
     }

     function getTileDiff(tile1, tile2){
     	var diff = {
     	    x: tile1.x - tile2.x,
     	    y: tile1.y - tile2.y
     	}
     	return diff;
     }

        // tilesAreAdjacent: function(tile1, tile2) {
	function tileColorsMatch(tile1, tile2) {
		return tile1.color !== undefined &&
		    tile1.color === tile2.color &&
		    tile1.occupied &&
		    tile2.occupied;
	};

	function getChains(tiles, processor, minumum) {
		var allSequences = [];
		var allMatchingChains = [];

		var columns = getAllAsColumns();
		var rows = getAllAsRows();
		var diagonals = getAllAsDiagonals();

		function getSegments(array) {
		    var segments = [];

		    for (var i = 0; i < array.length; i++) {
		        // from each position in the array
		        var maxSliceLength = array.length;

		        // get all possible slices
		        for (var sliceLength = 0; sliceLength <= maxSliceLength; sliceLength++) {
		            var slice = array.slice(i, sliceLength + 1);
		            segments.push(slice);
		        }
		    }


		    return segments;
		}

		columns.forEach(function(column) {
		    allSequences = allSequences.concat(getSegments(column));
		})


		rows.forEach(function(row) {
		    allSequences = allSequences.concat(getSegments(row));
		})

		diagonals.forEach(function(diagonal) {
		    allSequences = allSequences.concat(getSegments(diagonal));
		})


		allSequences.forEach(function(sequence) {
		    var success = true;
		    var originator = sequence[0];

		    if (!originator) {
		        return;
		    }

		    if (!originator.occupied || sequence.length < minumum) {
		        success = false;
		        return;
		    }

		    for (var i = 1; i < sequence.length; i++) {
		        var current = sequence[i];
		        if (current && processor(originator, current)) {

		        } else {
		            success = false;
		        }
		    }

		    if (success) {
		        allMatchingChains.push(sequence);
		    }
		});

		return allMatchingChains.sort(function(a, b) {
		    return b.length - a.length;
		});
	};

	function getTiles(matcher) {
	    if (matcher) {
	        return tiles.tiles.filter(matcher);
	    } else {
	        return tiles.tiles;
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
	    return tiles.tiles.filter(function(tile) {
	        return tile.x == index;
	    }).sort(function(a, b) {
	        return a.y - b.y;
	    });
	}

	function getDiagonalLR(index) {
	    return tiles.tiles.filter(function(tile) {
	        return tile.x - tile.y == index;
	    }).sort(function(a, b) {
	        return a.x - b.x;
	    });
	}


	function getDiagonalRL(index) {
	    return tiles.tiles.filter(function(tile) {
	        return tile.y + tile.x == index;
	    }).sort(function(a, b) {
	        return a.y - b.y;
	    });
	}


	function getAllAsDiagonals() {
	    // debugger;
	    var allDiagonals = [];
	    for (var i = 0; i < tiles.numColumns; i++) {
	        allDiagonals.push(getDiagonalLR(i));
	        allDiagonals.push(getDiagonalRL(i));
	    }
	    for (var k = 0; k < tiles.numRows; k++) {
	        // debugger;

	        allDiagonals.push(getDiagonalLR(-k - 1));
	        allDiagonals.push(getDiagonalRL(k + tiles.numColumns));
	    }
	    return allDiagonals;
	}
	function getAllAsRows() {
	    var allRows = [];
	    for (var i = 0; i < tiles.numRows; i++) {
	        allRows.push(getRow(i));                
	    }   
	    return allRows;
	}


	function getRow(index) {
	    return tiles.tiles.filter(function(tile) {
	        return tile.y == index;
	    }).sort(function(a, b) {
	        return a.x - b.x;
	    });
	}

	function getAllAsColumns() {
	    var allColumns = [];
	    for (var i = 0; i < tiles.numColumns; i++) {
	        allColumns.push(getColumn(i));
	    }
	    return allColumns;
	}


	function getTileAtCoordinates(x, y) {
	    return tiles.tiles.filter(function(tile) {
	        return tile.x == x && tile.y == y;
	    })[0];
	}

        // // },
        // // getTileDiff: function(tile1, tile2) {
        // //     var diff = {
        // //         x: tile1.x - tile2.x,
        // //         y: tile1.y - tile2.y
        // //     }
        // //     return diff;
        // // },
        // tileColorsMatch: function(tile1, tile2) {
            
        //         // tile1.canInteract && 
        //         // tile2.canInteract;
        // },
        // getChains: function(tiles, processor, minumum) {


          
        // }

    return {
    	tilesAreAdjacent:tilesAreAdjacent,
    	tileColorsMatch:tileColorsMatch,
    	getChains:getChains,
    	getTileDiff:getTileDiff,
    	getAllAsRows:getAllAsRows,
    	getAllAsColumns:getAllAsColumns,
    	getAllNeighbours:getAllNeighbours,
    	getAllAsDiagonals:getAllAsDiagonals,
    	getTiles:getTiles
    }
}
