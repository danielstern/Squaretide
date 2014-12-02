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
	}
}