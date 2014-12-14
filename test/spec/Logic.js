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

            describe('getting the index of a tile in a segment',function(){
                it('should return the right index',function(){
                    var indexOfTile = logic.indexOfTile;
                    assert.equal(indexOfTile([topLeftTile],topLeftTile), 0);
                    assert.equal(indexOfTile([topLeftTile,topRightTile],topRightTile), 1);
                    assert.equal(indexOfTile([topRightTile,topRightTile],topLeftTile), -1);
                    // assert.isTrue(tileInSegment(topRightTile,[topRightTile,topLeftTile]));
                    // assert.isFalse(tileInSegment(topRightTile,[topLeftTile,topLeftTile]));
                })
            });

            describe('seeing if a tile is an array',function(){
                it('say whether the tile is in the array',function(){
                    var tileInSegment = logic.tileInSegment;
                    assert.isTrue(tileInSegment([topLeftTile],topLeftTile));
                    assert.isTrue(tileInSegment([topRightTile,topLeftTile],topRightTile));
                    assert.isFalse(tileInSegment([topLeftTile,topLeftTile],topRightTile));
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


            describe("finding intersection",function(){
                it("should return a tile where two chains intersect if it exsit",function(){
                    var chain1 = [topLeftTile,topRightTile];
                    var chain2 = [topRightTile,bottomRightTile];
                    var chain3 = [bottomRightTile,bottomLeftTile];
                    assert.equal(logic.getIntersection(chain1,chain2),topRightTile);
                    assert.equal(logic.getIntersection(chain1,chain3),null);
                    assert.equal(logic.getIntersection(chain2,chain3),bottomRightTile);
                })
            })
            
            describe('consolidating chains',function(){
                it("should reduce the chains to the minumum possible number of groups",function(){
                    var chain1 = [topLeftTile,topRightTile];
                    var chain2 = [topRightTile,bottomRightTile];
                    assert.equal(logic.consolidateChains([chain1,chain2]).length,1);
                });
                it("should take two chains with similar elements and return an array of chains that are effectively combined",function(){
                    var chain1 = [topLeftTile,topRightTile];
                    var chain2 = [topRightTile,bottomRightTile];
                    assert.deepEqual(logic.consolidateChains([chain1,chain2]),[[topLeftTile,topRightTile,bottomRightTile]]);
                });
                it("should take three chains with similar elements and return an array of chains that are combined",function(){
                    var chain1 = [topLeftTile,topRightTile];
                    var chain2 = [topRightTile,bottomRightTile];
                    var chain3 = [bottomLeftTile,bottomRightTile];
                    assert.deepEqual(logic.consolidateChains([chain1,chain2,chain3]),[[topLeftTile,topRightTile,bottomRightTile,bottomLeftTile]]);
                })
                it("should not modify the chains",function(){
                    var chain1 = [topLeftTile,topRightTile];
                    var chain2 = [topRightTile,bottomRightTile];
                    logic.consolidateChains([chain1,chain2]);
                    assert.deepEqual(chain2,[topRightTile,bottomRightTile]);
                })
            })



        });
    });
})();
