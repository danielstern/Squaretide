var Logic = {
	getLastEmptyTile: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (!tile.occupied) {
				return tile;
			}
		}
	},
	getLastFullTile: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (tile.occupied) {
				return tile;
			}
		}
	},
	getLastEmptyIndex: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (!tile.occupied) {
				return i;
			}
		}
	},
	getLastFullIndex: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (tile.occupied) {
				return i;
			}
		}
	},
	columnHasGap: function(col) {
		var map = col.map(function(tile){
			return tile.occupied;
		});
		if (map.indexOf(false) > map.indexOf(true)) {
			// console.log("Found empty tile at index:",i);
			return true;
		}
		// var foundEmpty = false;
		// var hasGap = false;
		// for (var i = col.length; i > 0; i--) { 
		// 	var tile = col[i - 1];
		// 	if (!tile.occupied) {
		// 		console.log("Found empty tile at index:",i);
		// 		foundEmpty = true;
		// 	} else {
		// 		if (foundEmpty) {
		// 			hasGap = true;
		// 		} 
		// 	}
		// }

		// return hasGap;
	},
	tilesAreAdjacent:function (tile1, tile2) {
	    var diff = this.getTileDiff(tile1, tile2);
	    if (Math.abs(diff.x) + Math.abs(diff.y) == 1) {
	        return true;
	    };
	},
	getTileDiff: function (tile1, tile2) {
	    var diff = {
	        x: tile1.x - tile2.x,
	        y: tile1.y - tile2.y
	    }
	    return diff;
	},
	tileColorsMatch: function(tile1, tile2) {
        return tile1.color !== undefined && 
        tile1.color === tile2.color && 
        tile1.occupied && 
        tile2.occupied 
        // tile1.canInteract && 
        // tile2.canInteract;
    },
	getChains:function(tiles, processor, minumum) {
		var allSequences = [];
		var allMatchingChains = [];
		
		var columns = tiles.getAllAsColumns();
		var rows = tiles.getAllAsRows();
		var diagonals = tiles.getAllAsDiagonals();

		function getSegments(array) {
			var segments = [];

			for (var i = 0; i < array.length; i++) {
				// from each position in the array
				var maxSliceLength = array.length;

				// get all possible slices
				for (var sliceLength = 0; sliceLength <= maxSliceLength;sliceLength++) {
					var slice = array.slice(i,sliceLength + 1);
					segments.push(slice);
				}
			}


			return segments;
		}

		columns.forEach(function(column){
			allSequences = allSequences.concat(getSegments(column));	
		})


		rows.forEach(function(row){
			allSequences = allSequences.concat(getSegments(row));	
		})

		diagonals.forEach(function(diagonal){
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

		return allMatchingChains;
	}		
}
