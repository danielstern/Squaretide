/* Comprises an array of tiles with a number of members equal to row times
column. */
/* contains functions that modify the tiles. */

function Tileset(config) {

    var tiles = [];

    var numColumns = config.columns;
    var numRows = config.rows;
    for (var i = 0; i < numColumns; i++) {
        for (var k = 0; k < numRows; k++) {
            var tile = {};
            tile.x = i;
            tile.y = k;

            // var square = new TileVisualizer(tile);
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
        var diff = getTileDiff(tile1, tile2);
        tile1.x -= diff.x;
        tile1.y -= diff.y;

        tile2.x += diff.x;
        tile2.y += diff.y;
    }

    function getRow(index) {
        return tiles.filter(function(tile) {
            return tile.y == index;
        }).sort(function(a, b) {
            return a.x - b.x;
        });
    }

    function getRows() {
        var allRows = [];
        for (var i = 0; i < numRows; i++) {
            allRows.push(getRow(i));                
        }   
        return allRows;
    }


    return {
        
        numRows:numRows,
        numColumns:numColumns,
        getRows:getRows,
        getRow:getRow,
    }
}
