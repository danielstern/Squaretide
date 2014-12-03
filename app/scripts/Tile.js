function Tile() {
	var tile = this;
	this.resolve = function(){

		tile.resolved = true;
		tile.canInteract = false;
		tile.occupied = false;

		// setTimeout(function(){
		// },350);

	}

	this.activate = function() {
		tile.occupied = true;
		tile.resolved = false;
		tile.canInteract = true;
		
		// setTimeout(function(){
		// },350)
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