/* Comprises an array of tiles with a number of members equal to row times
column. */
/* contains functions that modify the tiles. */

function Tileset(columns, rows, logic) {

    var tiles = [];
    var numColumns;
    var numRows;

    numColumns = columns;
    numRows = rows;
    for (var i = 0; i < columns; i++) {
        for (var k = 0; k < rows; k++) {
            var tile = {};
            tile.x = i;
            tile.y = k;

            var square = new TileVisualizer(tile);
            tiles.push(tile);
        }
    };

   


    // function compressColumn(column) {
    //     for (var i = column.length; i > 0; i--) {
    //         var tile = column[i - 1];
    //         if (tile.occupied) {
    //             for (var k = column.length; k > i; k--) {
    //                 var tile2 = column[k - 1];
    //                 if (!tile2.occupied) {
    //                     switchTiles(tile, tile2);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }

    

    function flattenBottom() {

        // the code graveyard


        // getAllAsColumns().forEach(function(column,index){
        //     // if (Logic.columnHasGap(column)){
        //     while (Logic.columnHasGap(column)){
        //         // f?or (var i = 7; i > 0; i--) {
        //             compressColumn(column);
        //             console.log("Gap?",Logic.columnHasGap(column));
        //         // }

        //         column = getColumn(index);
        //     }
        //         // for ()
                
        //     // }
        // });
        //     for (var i = 0; i < numColumns; i++) {
        //         var column = getColumn(i);
        //         // console.log("Getting collumn...",column,i);
        //         while (Logic.columnHasGap(column)){
        //             column.forEach(function(tile){

        //                 // var tile = column[i - 1];
        //                 if (tile.occupied) {
        //                     for (var k = column.length; k > i; k--) {
        //                         var tile2 = column[k - 1];
        //                         if (!tile2.occupied) {
        //                             switchTiles(tile, tile2);
        //                             break;
        //                         }
        //                     }
        //                 }
        //             })
        //             column = getColumn[i];
        //         }


        //     // var columns = getAllAsColumns();
        //     // columns.forEach(function(column){
        //         // for (var i = column.length; i > 0;i--) {
        //     // })
        //     }
        // // }
        // for (var i = 7; i > 0; i--) {
        //     var columns = getAllAsColumns();
        //     columns.forEach(function(column){
        //         for (var i = column.length; i > 0;i--) {
        //             var tile = column[i - 1];
        //             if (tile.occupied) {
        //                 for (var k = column.length; k > i; k--) {
        //                     var tile2 = column[k - 1];
        //                     if (!tile2.occupied) {
        //                         switchTiles(tile, tile2);
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //     })
        // }
    }


    function switchTiles(tile1, tile2) {
        var diff = logic.getTileDiff(tile1, tile2);
        tile1.x -= diff.x;
        tile1.y -= diff.y;

        tile2.x += diff.x;
        tile2.y += diff.y;
    }


    return {
        
        tiles:tiles,
        numRows:numRows,
        numColumns:numColumns,
        switchTiles:switchTiles,
        flattenBottom:flattenBottom,
    }
}
