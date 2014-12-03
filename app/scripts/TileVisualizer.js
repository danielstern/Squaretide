function TileVisualizer() {

	var div1=document.getElementById('gamefield');//get the div element
	var div2=document.createElement("square");//create a new div
	div1.appendChild(div2);// append to div

	var tile;
	var visualizer = this;
	var finished = false;
	var isTouchDevice = false;

	div2.addEventListener("touchstart",function(){
		isTouchDevice = true;
		onClick();
	});
	div2.addEventListener("click",function(){
		if (!isTouchDevice) {
			onClick();
		}	
	});

	 function onTick() {
	 	if (finished) {
	 		return;
	 	}
		div2.setAttribute("x", tile.x); 
		div2.setAttribute("y", tile.y); 
		div2.setAttribute("color",tile.color);
		div2.setAttribute("selected",tile.selected);
		div2.setAttribute("resolved",tile.resolved);
		div2.setAttribute("occupied",tile.occupied);

		if (tile.occupied) {
			div2.setAttribute("fly","in");
		} else {
			div2.setAttribute("fly","out");
		}
	};

	setInterval(onTick, 33);
	function onClick() {
		console.log("Tile:", tile)
		if (tile.selected) {
			tile.selected = false;
		} else {
			tile.selected = true;
		}
	};
	function attachToTile(_tile) {
		tile = _tile;
	}

	return {
		attachToTile:attachToTile,
		onTick:onTick,
	}
}
