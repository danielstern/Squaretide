/* contains operations that do not modify the array of tiles. */


var Logic = function() {

    function getSegments(array) {
        var segments = [];
        var maxSubsetLength = array.length;

        for (var i = 0; i < array.length; i++) {

            var subsetLength = maxSubsetLength - i;
            var startPosition = i;

            for (var k = 0; k < subsetLength; k++) {
                var endPosition = startPosition + k + 1;
                var subset = array.slice(startPosition, endPosition);
                segments.push(subset);
            }
        }

        return segments;
    }

    function removeDuplicateTilesFromChain(array) {
    	var newArray = [];
    	array.forEach(function(elem){
    		if (!tileInSegment(newArray,elem)) {
    			newArray.push(elem);
    		}
    	});

    	return newArray;
    }

    function consolidateChains(arrays) {
    	console.log("Consolidaing..",arrays);
        var consolidatedArrays = [];
        arrays = arrays.map(function(array){
        	return array.slice(0);
        })
        // arrays = arrays.slice(0);

        arrays.forEach(function(array) {
        	if (array) {
	            // for (var i = arrays.length; i >= 0; i--) {
	            for (var i = 0; i < arrays.length; i++) {
	                var innerArray = arrays[i];
	                // console.log("Comparing...",array,innerArray);
	                if (innerArray) {
	                	var intersection = getIntersection(array, innerArray);
	                	if (intersection) {
		                	while (innerArray.length > 0) {
		                		array.push(innerArray.pop());
		                	};
	                	}
	                	// if (intersection) {
	                	//     innerArray.splice(indexOfTile(innerArray, intersection), 1);
	                	//     arrays.splice(i, 1);
	                	// }
	                }
	                
	            }
            	consolidatedArrays.push(removeDuplicateTilesFromChain(array));
        	}
        });

    	// if (array) {
     //        for (var i = arrays.length; i >= 0; i--) {
     //            var innerArray = arrays[i - 1];
     //            if (innerArray) {
     //            	var intersection = getIntersection(array, innerArray);
     //            	if (intersection) {
     //            		var itemsForMigration = innerArray.splice(indexOfTile(innerArray, intersection), 1);
                		
     //            	    consolidatedArrays.push(array.concat(itemsForMigration));
     //            		// console.log("intersection...",array.concat(innerArray))
     //            	    arrays.splice(i, 1);
     //            	}
     //            }
                
     //        }
    	// }


        console.log("Final arrays",consolidatedArrays);


        return consolidatedArrays.filter(function(array){
        	return array.length > 0;
        });
    }

    function getIntersection(array1, array2) {
        var intersection = null;
        array1.forEach(function(tile) {
            if (array1 !== array2 && tileInSegment(array2, tile)) {
                // console.log("these chains intersect");
                intersection = tile;
            }
        })

        return intersection;
    }


    function sequenceIsChain(array, processor) {

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

    function getAllSegments(tiles) {
        var allSequences = [];


        var array = tiles.getColumns()
            .concat(tiles.getRows())
            .concat(tiles.getDiagonals());


        array.forEach(function(column) {
            allSequences = allSequences.concat(getSegments(column));
        });

        return allSequences;
    }

    function tileInSegment(segment, tile) {
        return indexOfTile(segment, tile) > -1;
    }

    function indexOfTile(segment, tile) {
        var index = -1;
        var matches = segment.filter(function(element, _index) {
            if (element.x === tile.x && element.y === tile.y) {
                index = _index;
            }
        })

        return index;
    }


    function getChains(tiles, processor, minimum) {
        var allMatchingChains = [];

        var allSequences = getAllSegments(tiles);

        allSequences.forEach(function(sequence) {
            if (sequenceIsChain(sequence, processor)) {
                allMatchingChains.push(sequence);
            }
        });

        return allMatchingChains
            .filter(function(chain) {
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

    function tilesAreAdjacent(tile1, tile2) {
        var diff = getTileDiff(tile1, tile2);
        if (Math.abs(diff.x) + Math.abs(diff.y) === 1) {
            return true;
        } else {
            return false;
        }
    }

    function isSameTile(tile1, tile2) {
        var diff = getTileDiff(tile1, tile2);
        if (Math.abs(diff.x) + Math.abs(diff.y) === 0) {
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


    function getTileDiff(tile1, tile2) {
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
        tilesAreAdjacent: tilesAreAdjacent,
        tileColorsMatch: tileColorsMatch,
        arrayHasEmptyTileAfterFullTile: arrayHasEmptyTileAfterFullTile,
        getChains: getChains,
        getTileDiff: getTileDiff,
        getLastUnoccupiedIndex: getLastUnoccupiedIndex,
        getLastOccupiedIndex: getLastOccupiedIndex,
        tileColorsMatch: tileColorsMatch,
        getSegments: getSegments,
        sequenceIsChain: sequenceIsChain,
        getOccupied: getOccupied,
        getAllSegments: getAllSegments,
        tileInSegment: tileInSegment,
        indexOfTile: indexOfTile,
        consolidateChains: consolidateChains,
        getIntersection: getIntersection,
    }
}

var logic = new Logic();
