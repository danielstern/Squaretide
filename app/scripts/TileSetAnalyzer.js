var TileSetAnalyzer = {
	getLastEmptyTile: function(col) {
		for (var i = col.length - 1; i >= 0; i--) { 
			var tile = col[i];
			if (!tile.occupied) {
				return tile;
			}
		}
	},
	getChains:function(tiles, processor, minumum) {
		var allSequences = [];
		var allMatchingChains = [];
		
		var columns = tiles.getAllAsColumns();
		var rows = tiles.getAllAsRows();
		var diagonals = tiles.getAllAsDiagonals();

		function getSegments(array) {
			var segments = [];

			// debugger;
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
			// console.log("Valid sequence..",sequence);
			
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
