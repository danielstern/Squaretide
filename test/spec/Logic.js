/* global describe, it */

(function() {
    'use strict';

    describe('The tileset logic', function() {

        describe('analzing arrays of tiles', function() {

        	var emptyTile = {
        	    occupied: false
        	};

        	var fullTile = {
        	    occupied: true
        	};

        	var redTile = {
        		occupied: true,
        		color:0,
        	};

        	var blueTile = {
        		occupied: true,
        		color:1,
        	};

        	var topLeftTile = {
        		x:0,
        		y:0
        	};

        	var topRightTile = {
        		x: 1,
        		y: 0
        	};

        	var bottomLeftTile = {
        		x: 0,
        		y: 1,
        	};

        	var bottomRightTile = {
        		x: 1,
        		y: 1
        	};

            describe('get last unoccupied index', function() {
                it('should return the member of the array with the highest index where the occupied property is false', function() {
                	var getLastUnoccupiedIndex = logic.getLastUnoccupiedIndex;
                    assert.equal(getLastUnoccupiedIndex([emptyTile, emptyTile, fullTile]), 1);
                    assert.equal(getLastUnoccupiedIndex([fullTile, fullTile, fullTile]), -1);
                    assert.equal(getLastUnoccupiedIndex([fullTile, emptyTile, fullTile, emptyTile]), 3);

                });
            });

            describe('get last occupied index', function() {
                it('should return the member of the array with the highest index where the occupied property is true', function() {
                	var getLastOccupiedIndex = logic.getLastOccupiedIndex;
                    assert.equal(getLastOccupiedIndex([emptyTile, emptyTile, fullTile]), 2);
                    assert.equal(getLastOccupiedIndex([fullTile, fullTile, emptyTile,fullTile]), 3);
                    assert.equal(getLastOccupiedIndex([emptyTile]), -1);
                    assert.equal(getLastOccupiedIndex([fullTile, emptyTile, fullTile, emptyTile]), 2);
                });
            });

            describe('tiles color match',function(){
            	it('should return true when both tiles are the same color',function(){
            		var tileColorsMatch = logic.tileColorsMatch;
            		assert.equal(tileColorsMatch(redTile,blueTile), false);
            		assert.equal(tileColorsMatch(blueTile,blueTile), true);
            		assert.equal(tileColorsMatch(redTile,redTile), true);
            	})
            })

            describe('tiles are adjacent',function(){
            	it('should return true when two tiles are next to each other',function(){
            		var tilesAreAdjacent = logic.tilesAreAdjacent;
            		assert.equal(tilesAreAdjacent(topLeftTile,topRightTile), true);
            		assert.equal(tilesAreAdjacent(topRightTile,bottomRightTile), true);
            		assert.equal(tilesAreAdjacent(topRightTile,bottomLeftTile), false);
            	})
            })

            describe('array has a gap in it', function() {
                it('should return true if an array has en empty tile afer a full one', function() {
                	var arrayHasEmptyTileAfterFullTile = logic.arrayHasEmptyTileAfterFullTile;
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile,fullTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile,emptyTile]), true);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile, emptyTile, fullTile]), true);
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile, fullTile, emptyTile]), true);
                });
            });

            describe('getting all the segments from an array',function(){
            	it('should return all segments of an array',function(){
            		var getSegments = logic.getSegments;
            		assert.equal(getSegments([0]).length,1);
            		assert.equal(getSegments([0,1]).length,3);
            		assert.equal(getSegments([0,1,2]).length,6);
            		assert.equal(getSegments([0,1,2,3]).length,10);
            	})
            });

            describe("identifying a chain",function(){
            	it ('should correctly identify an array that is a chain',function(){
            		var sequenceIsChain = logic.sequenceIsChain;
            		var processor = logic.tileColorsMatch;

            		assert.isTrue(sequenceIsChain([blueTile,blueTile,blueTile],processor));
            		assert.isTrue(sequenceIsChain([redTile,redTile,redTile,redTile],processor));
            		assert.isFalse(sequenceIsChain([redTile,blueTile,redTile,redTile],processor));
            	});
            })

            describe("finding all chains",function(){
                // errrr 
                // it ('should correctly all the chains in a tileset',function(){
                //     var getChains = logic.getChains;
                //     var processor = logic.tileColorsMatch;
                //     var tiles = new Tileset({rows:4,columns:3});
                //     tiles.getTileAtCoordinates({x:0,y:0}).color = 1;
                //     tiles.getTileAtCoordinates({x:0,y:0}).occupied = true;
                //     tiles.getTileAtCoordinates({x:1,y:0}).color = 1;
                //     tiles.getTileAtCoordinates({x:1,y:0}).occupied = true;
                //     tiles.getTileAtCoordinates({x:2,y:0}).color = 1;
                //     tiles.getTileAtCoordinates({x:2,y:0}).occupied = true;
                //     // tiles.getTileAtCoordinates({x:3,y:0}).color = 1;
                //     // tiles.getTileAtCoordinates({x:3,y:0}).occupie/d = true;
                //     // tiles.getTileAtCoordinates({x:3,y:0}).color = 1;

                //     assert.equal(getChains(tiles,processor).length, 5);
                //     // assert.isTrue(sequenceIsChain([redTile,redTile,redTile,redTile],processor));
                //     // assert.isFalse(sequenceIsChain([redTile,blueTile,redTile,redTile],processor));
                // });
            })
        });
    });
})();
