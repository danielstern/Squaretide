function Tile() {
	var tile = this;
	this.resolve = function(){
		tile.canInteract = false;
		tile.occupied = false;
	}

	this.activate = function() {
		tile.occupied = true;
		tile.canInteract = true;
	}

	this.suspend = function(time,callback) {
		tile.canInteract = false;

		setTimeout(function() {
		    tile.canInteract = true;
		    if (callback) {
		    	callback(tile);
		    }
		}, time || 350);
	}
}