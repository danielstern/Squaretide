function Tile() {
	var tile = this;
	this.resolve = function(){

		tile.resolved = true;
		tile.canInteract = false;

		setTimeout(function(){
			tile.occupied = false;
		},500);

	}

	this.activate = function() {
		tile.occupied = true;
		tile.resolved = false;
		
		setTimeout(function(){
			tile.canInteract = true;
		},350)
	}

	this.suspend = function(time) {
		tile.canInteract = false;

		setTimeout(function() {
		    tile.canInteract = true;
		}, time || 350);
	}
}