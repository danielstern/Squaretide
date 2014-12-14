function TileVisualizer(tile) {

    var div1 = document.getElementById('gamefield'); //get the div element
    if (!div1) {
        return;
    }
    var div2 = document.createElement("square"); //create a new div
    div1.appendChild(div2); // append to div

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

        if (tile.deactivated) {
            clearInterval(interval);
        }

        // console.log("Columns?",window._numColumns)

        var width = 100/_numColumns;
        var height = 100/_numRows;

        for (key in tile) {
            div2.setAttribute(key, tile[key]);            
        }
        div2.setAttribute('style',
            'width:'+width+'%;'
            + 'height:'+height+'%;'
            + 'top:'+height *tile.y+'%;'
            + 'left:'+width *tile.x+'%;'
            );
        // div2.setAttribute('style','height:7%');
    };

    var interval = setInterval(onTick, 33);

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
