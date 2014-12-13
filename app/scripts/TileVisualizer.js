function TileVisualizer(tile) {

    var div1 = document.getElementById('gamefield'); //get the div element
    var div2 = document.createElement("square"); //create a new div
    if (div1) {
        div1.appendChild(div2); // append to div
    }

    var visualizer = this;
    var isTouchDevice = false;

    div2.addEventListener("touchstart", function() {
        isTouchDevice = true;
        onClick();
    });
    div2.addEventListener("click", function() {
        if (!isTouchDevice) {
            onClick();
        }
    });

    function onTick() {

        for (key in tile) {
            div2.setAttribute(key, tile[key]);            
        }
    };

    setInterval(onTick, 33);

    function onClick() {
        if (tile.selected) {
            tile.selected = false;
        } else {
            tile.timeSelected = new Date().getTime();
            tile.selected = true;

            soundManager.tone(tile.color, 50);
        }
    };
}
