package {
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.*;
	public class Square extends MovieClip {
		public var startX = 0;
		public var startY = 0;
		public function Square() {
			super();
		}
		
		
		public function attachToTile(tile:Tile) {
			addEventListener(Event.ENTER_FRAME, function() {
				x = startX + tile.x * 48;
				y = startY + tile.y * 48;
				
				if (tile.occupied) {
					alpha = 1;
				} else {
					alpha = 0;
				}
				
				if (tile.color) {
					fill.gotoAndStop(tile.color);				
				} else {
				    fill.gotoAndStop("NONE");	
				}
			});
			
			addEventListener(MouseEvent.CLICK, function() {
				if (tile.selected) {
					tile.selected = false;
				} else {
					tile.selected = true;
				}
			})
		}
	}
}