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
                    assert.equal(getLastUnoccupiedIndex([emptyTile, emptyTile, fullTile]), 1);
                    assert.equal(getLastUnoccupiedIndex([fullTile, fullTile, fullTile]), -1);
                    assert.equal(getLastUnoccupiedIndex([fullTile, emptyTile, fullTile, emptyTile]), 3);

                });
            });

            describe('get last occupied index', function() {
                it('should return the member of the array with the highest index where the occupied property is true', function() {
                    assert.equal(getLastOccupiedIndex([emptyTile, emptyTile, fullTile]), 2);
                    assert.equal(getLastOccupiedIndex([fullTile, fullTile, emptyTile,fullTile]), 3);
                    assert.equal(getLastOccupiedIndex([emptyTile]), -1);
                    assert.equal(getLastOccupiedIndex([fullTile, emptyTile, fullTile, emptyTile]), 2);
                });
            });

            describe('tiles color match',function(){
            	it('should return true when both tiles are the same color',function(){
            		assert.equal(tileColorsMatch(redTile,blueTile), false);
            		assert.equal(tileColorsMatch(blueTile,blueTile), true);
            		assert.equal(tileColorsMatch(redTile,redTile), true);
            	})
            })

            describe('tiles are adjacent',function(){
            	it('should return true when two tiles are next to each other',function(){
            		assert.equal(tilesAreAdjacent(topLeftTile,topRightTile), true);
            		assert.equal(tilesAreAdjacent(topRightTile,bottomRightTile), true);
            		assert.equal(tileColorsMatch(topRightTile,bottomLeftTile), false);
            	})
            })

            describe('array has a gap in it', function() {
                it('should return true if an array has en empty tile afer a full one', function() {
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile,fullTile]), false);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile,emptyTile]), true);
                    assert.equal(arrayHasEmptyTileAfterFullTile([fullTile, emptyTile, fullTile]), true);
                    assert.equal(arrayHasEmptyTileAfterFullTile([emptyTile, fullTile, emptyTile]), true);
                });
            });
        });
    });
})();
