describe("the squaretide game engine",function(){

	describe("the game initialization",function(){
		it('should create an tileset with the right number of tiles',function(){
			var game = new Squaretide({rows:11,columns:7});
			assert.equal(game.tiles.getRows().length, 11);
			assert.equal(game.tiles.getColumns().length, 7);
		})
	});

	describe("Getting a safe color",function(){
		
		describe("when passing it a tile",function(){
			describe("the value it returns",function(){
				
				it ('should throw an error if there is no safe color',function(){
					var game = new Squaretide({rows:3,columns:3,colors:3});
					var getSafeColor = game.getSafeColor;
					var tiles = game.tiles;
					tiles.getTiles().forEach(function(tile){
						tile.occupied = true;
					})
					tiles.getTileAtCoordinates({x:1,y:0}).color = 0;
					tiles.getTileAtCoordinates({x:2,y:0}).color = 0;
					tiles.getTileAtCoordinates({x:0,y:1}).color = 1;
					tiles.getTileAtCoordinates({x:0,y:2}).color = 1;
					tiles.getTileAtCoordinates({x:1,y:1}).color = 2;
					tiles.getTileAtCoordinates({x:2,y:2}).color = 2;
					assert.throws(function(){
						getSafeColor(tiles.getTileAtCoordinates({x:0,y:0}));
					}, Error);
				})
				it("should return a valid color if one is possible",function(){
					// assert.equal
					var game = new Squaretide({rows:3,columns:3,colors:4});
					var getSafeColor = game.getSafeColor;
					var tiles = game.tiles;
					tiles.getTiles().forEach(function(tile){
						tile.occupied = true;
					})
					tiles.getTileAtCoordinates({x:1,y:0}).color = 0;
					tiles.getTileAtCoordinates({x:2,y:0}).color = 0;
					tiles.getTileAtCoordinates({x:0,y:1}).color = 1;
					tiles.getTileAtCoordinates({x:0,y:2}).color = 1;
					tiles.getTileAtCoordinates({x:1,y:1}).color = 2;
					tiles.getTileAtCoordinates({x:2,y:2}).color = 2;
					assert.equal(getSafeColor(tiles.getTileAtCoordinates({x:0,y:0})), 3);
				});
			})
		})
	})
})