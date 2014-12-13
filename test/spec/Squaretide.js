describe("the squaretide game engine",function(){
	
	describe("the game initialization",function(){
		beforeEach(function(){
			// var Jukebox = new Jukebox();s
		})
		it('should create an tileset with the right number of tiles',function(){
			var game = new Squaretide({rows:11,columns:7});
			assert.equal(game.tiles.getRows().length, 11);
			assert.equal(game.tiles.getColumns().length, 7);
		})
	});

	describe("Getting a safe color",function(){
		var game = new Squaretide({rows:4,columns:4,colors:3});
		var getSafeColor = game.getSafeColor;
		describe("when passing it a tile",function(){
			describe("the value it returns",function(){
				it("should not cause any chains to be triggered",function(){
					// assert.equal
				});
			})
		})
	})
})