package  {
	
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.utils.setInterval;
	import flash.events.Event;
	import Tile;
	import TileSetAnalyzer;

	
	public class Squaretide extends MovieClip {	
		
		public function Squaretide() {
			
			var tileFrequency:Number = 10;
			var timeSinceLasttile:Number = 0;
			var xStart = playfield.x;
			var yStart = playfield.y;
			var ROWS = 6;
			var COLUMNS = 10;
			var score = 1;
			var gridSize = 48;
			var tiles:Tileset;
	
			function getRandomColor(){
				var colors = ["BLUE",'RED','GREEN','GOLD'];
				return colors[Math.floor(Math.random() * colors.length)];
			}

			start.addEventListener(MouseEvent.CLICK, startGame);

			function startGame() {		
				tiles = new Tileset(COLUMNS,ROWS);
				addEventListener(Event.ENTER_FRAME, onEnterFrame)					
			}

			function onEnterFrame() {
				
				var activetiles = tiles.getMatchingTiles(function(tile){
					return tile.selected;
				});

				if (activetiles.length > 1) {
					

					var tile1 = activetiles[0];
					var tile2 = activetiles[1];
					
					tile1.selected = false;
					tile2.selected = false;

					if (tiles.tilesAreAdjacent(tile1,tile2)) {
						
						tiles.switchTiles(tile1, tile2)	;
					}
				
				}

				timeSinceLasttile+=1;
				if (timeSinceLasttile >= tileFrequency) {
					addTile();
					timeSinceLasttile = 0;
				};
				
			}

			
			function addTile() {
				var columns = tiles.getAllAsColumns();
				
				var column:Array = columns[Math.floor(Math.random() * columns.length)];
				
				var lastEmpty:Tile = TileSetAnalyzer.getLastEmptyTile(column);
				
				if (lastEmpty) {
					var coordinate = lastEmpty;
					coordinate.occupied = true;
					coordinate.color = getRandomColor();
					var square = new Square();
					playfield.addChild(square);
					square.attachToTile(lastEmpty);
				}
			}
		}
	}
}
