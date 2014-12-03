package {
	public class TileSetAnalyzer {
		public static function getLastEmptyTile(col:Array) {
			for (var i = col.length - 1; i >= 0; i--) { 
				var tile:Tile = col[i];
				if (tile.occupied == false) {
					return tile;
				}
			}
		}	
		
		public static function getChains(tiles:Tileset, processor:Function, minumum):Array{
			var allSequences = [];
			var allMatchingChains = [];
			
			
			
			var columns:Array = tiles.getAllAsColumns();
			var rows:Array = tiles.getAllAsRows();
			var diagonals:Array = tiles.getAllAsDiagonals();
			
			//columns.fo
			function getAllSegments(column) {
				var maxSliceSize = column.length;
				var minSliceSize = minumum;
				for (var sliceSize = minumum; sliceSize <= maxSliceSize; sliceSize++) {
					var totalSlices = maxSliceSize - sliceSize;
					for (var sliceIndex = 1; sliceIndex < totalSlices; sliceIndex++) {
						allSequences.push(column.slice(sliceIndex, sliceSize))	
					}					
				}
			}
			
			columns.forEach(getAllSegments);
			
			//return allSequences;
			
			allSequences.forEach(function(sequence) {
				var success = true;
				var originator = sequence[0];
				
				//trace(sequence.length);

				if (!originator.occupied) {
					success = false;
				}
				
				for (var i = 1; i < sequence.length; i++) {
					var current = sequence[i];
					if (processor(originator, current)) {
						
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
}