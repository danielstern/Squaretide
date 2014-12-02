package {
	
	import Tile;

	/* Creates a rectangular grid of tiles any size. */
	/* Can add new tiles with any properties to any square. */
	/* Can "flatten" empty tiles down. */
	/* Can return tiles in a row or column that match any matcher pattern.*/

	public class Tileset extends Array {

		var tiles:Array = [];
		var numColumns:Number;
		var numRows:Number;

		public function Tileset(columns:Number,rows:Number,adjuster:Function = null)  {
			numColumns = columns;
			numRows = rows;
			for (var i = 0; i <= columns; i++) {
				for (var k = 0; k < rows; k++) {
					var tile = new Tile();
					tile.x = i;
					tile.y = k;
					if (adjuster != null) {
						adjuster(tile);
					};
					
					tiles.push(tile);
				}
			};
		}

		public function getTiles() {
			return tiles;
		}
		
		public function getColumn(index) {
			return tiles.filter(function(tile) {
				return tile.x == index;
			}).sort(function(a,b) {
				return a.y - b.y;
			});
		}
		
		public function getRow(index) {
			return tiles.filter(function(tile) {
				return tile.y == index;
			})
		}
		
		public function getAllAsColumns() : Array {
			var allColumns = [];
			for (var i = 0; i < numColumns; i++) {
				allColumns.push(getColumn(i));				
			}	
			return allColumns;
		}

		public function getMatchingTiles(matcher) {
			return tiles.filter(matcher);
		}

		public function getTileAtCoordinates(x:Number,y:Number) {
			return tiles.filter(function(tile){
				return tile.x == x && tile.y == y;
			})[0];
		}

		public function getAllMatchingRows(matcher, minimum) {

		}

		function getTileDiff(tile1:Tile,tile2:Tile) {
			var diff = {
				x: tile1.x - tile2.x,
				y: tile1.y - tile2.y
			}
			return diff;
		}

		function switchTiles(tile1:Tile, tile2:Tile) {
			trace("Switching tiles.");
			var diff = getTileDiff(tile1, tile2);
			tile1.x -= diff.x;
			tile1.y -= diff.y;
			
			tile2.x += diff.x;
			tile2.y += diff.y;
		}

		function tilesAreAdjacent(tile1:Tile,tile2:Tile) {
			var diff = getTileDiff(tile1,tile2);
			if (Math.abs(diff.x) + Math.abs(diff.y)  == 1) {
				return true;
			};
		}						
	}
}