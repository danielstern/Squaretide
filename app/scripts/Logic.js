/* contains operations that do not modify the array of tiles. */

function getOccupied(tile) {
	return tile.occupied;
}

function getLastUnoccupiedIndex(array) {
	return array.map(getOccupied).lastIndexOf(false);
};

function getFirstOccupiedIndex(array) {
   	return array.map(getOccupied).indexOf(true);
};


function getLastOccupiedIndex(array) {
   	return array.map(getOccupied).lastIndexOf(true);
};

function tilesAreAdjacent(tile1, tile2){
	var diff = getTileDiff(tile1, tile2);
	if (Math.abs(diff.x) + Math.abs(diff.y) == 1) {
	    return true;
	};
}

function tileColorsMatch(tile1, tile2) {
	return tile1.color !== undefined &&
	    tile1.color === tile2.color &&
	    tile1.occupied &&
	    tile2.occupied;
};


function getTileDiff(tile1, tile2){
	var diff = {
	    x: tile1.x - tile2.x,
	    y: tile1.y - tile2.y
	}
	return diff;
}

function arrayHasEmptyTileAfterFullTile(array) {

    if (getLastUnoccupiedIndex(array) === -1 || getLastOccupiedIndex(array) === -1) {
    	return false;
    }
    if (getFirstOccupiedIndex(array) <= getLastUnoccupiedIndex(array)) {
    	return true;
    } else {
    	return false;
    }
        
};

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


var Logic = function(tiles) {

	function getChains(tiles, processor, minumum) {
		var allSequences = [];
		var allMatchingChains = [];

		var columns = tiles.getColumns();
		var rows = tiles.getRows();
		var diagonals = tiles.getDiagonals();


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

		// tiles.getColumns()
		// .concat(tiles.getRows())
		// .concat(tiles.getDiagonals())
		// .forEach(function(sequence) {
		// 	// console.log("Found a matching chain",sequence[0])
		//     var success = true;
		//     var originator = sequence[0];

		//     if (!originator) {
		//         return;
		//     }

		//     if (!originator.occupied || sequence.length < minumum) {
		//         success = false;
		//         return;
		//     }

		//     for (var i = 1; i < sequence.length; i++) {
		//         var current = sequence[i];
		//         if (current && processor(originator, current)) {

		//         } else {
		//             success = false;
		//         }
		//     }

		//     if (success) {
		//         allMatchingChains.push(sequence);
		//     }
		// });


		return allMatchingChains.sort(function(a, b) {
		    return b.length - a.length;
		});
	};

    return {
    	tilesAreAdjacent:tilesAreAdjacent,
    	tileColorsMatch:tileColorsMatch,
    	arrayHasEmptyTileAfterFullTile:arrayHasEmptyTileAfterFullTile,
    	getChains:getChains,
    	getTileDiff:getTileDiff
    }
}
