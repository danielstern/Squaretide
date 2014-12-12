describe('the tile set',function(){
	describe("initializing the tile set",function(){
		describe("straight lines",function(){						
			it ("should have rows equal in number to the rows argument",function(){
				assert.equal(new Tileset({rows:4,columns:6}).getRows().length,4);
				assert.equal(new Tileset({rows:2,columns:2}).getRows().length,2);
			});

			it ("should have the right number of columns",function(){
				assert.equal(new Tileset({rows:4,columns:6}).getColumns().length,6);
				assert.equal(new Tileset({rows:2,columns:2}).getColumns().length,2);
			});
		})

		describe("diagonals",function(){
			describe("getting single diagonals",function(){
				it ("should return proper left-right diagonals",function(){
					var tileset = new Tileset({rows:4,columns:4})
					assert.equal(tileset.getDiagonalLR(0).length,4);
					assert.equal(tileset.getDiagonalLR(1).length,3);
					assert.equal(tileset.getDiagonalLR(4).length,0);
					assert.equal(tileset.getDiagonalLR(-1).length,3);
				});

				it ("should return proper right-left diagonals",function(){
					var tileset = new Tileset({rows:4,columns:6})
					assert.equal(tileset.getDiagonalRL(0).length,1)
					assert.equal(tileset.getDiagonalRL(1).length,2)
					assert.equal(tileset.getDiagonalRL(4).length,4)
					assert.equal(tileset.getDiagonalRL(-1).length,0)
				});

				it("should sanely return all diagonals",function(){
					assert.equal(new Tileset({rows:3,columns:3}).getDiagonals().length, 10);
					assert.equal(new Tileset({rows:4,columns:3}).getDiagonals().length, 12);
					assert.equal(new Tileset({rows:3,columns:4}).getDiagonals().length, 12);
				});

			})
		})
	})
})