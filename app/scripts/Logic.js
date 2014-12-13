/* contains operations that do not modify the array of tiles. */



var Logic = function() {

	function getSegments(array) {
	    var segments = [];

	    for (var i = 0; i < array.length; i++) {
	        // var maxSliceLength = array.length;
	        var maxSubsetLength = array.length - i;

	        for (var k = 1; k <= maxSubsetLength; k++) {
	        	var subset = array.slice(i,k+1);
	        	segments.push(subset);
	        }
	    }

	    return segments;
	}

	function sequenceIsChain(array,processor) {

		success = true;

		for (var i = 0; i < array.length - 1; i++) {
		    var current = array[i];
		    var next = array[i + 1]
		    if (!processor(current, next)) {
		        success = false;
		    }
		}

		return success;
	}


	function getChains(tiles, processor, minimum) {
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
		    if (sequenceIsChain(sequence,processor)) {
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


		return allMatchingChains
		.filter(function(chain){
			return chain.length >= minimum;
		})
		.sort(function(a, b) {
		    return b.length - a.length;
		});
	};

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
		if (Math.abs(diff.x) + Math.abs(diff.y) === 1) {
		    return true;
		} else {
			return false;
		}
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



    return {
    	tilesAreAdjacent:tilesAreAdjacent,
    	tileColorsMatch:tileColorsMatch,
    	arrayHasEmptyTileAfterFullTile:arrayHasEmptyTileAfterFullTile,
    	getChains:getChains,
    	getTileDiff:getTileDiff,
    	getLastUnoccupiedIndex:getLastUnoccupiedIndex,
    	getLastOccupiedIndex:getLastOccupiedIndex,
    	tileColorsMatch:tileColorsMatch,
    	getSegments:getSegments,
    	sequenceIsChain:sequenceIsChain,
    }
}

var logic = new Logic();