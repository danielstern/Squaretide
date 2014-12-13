describe("the squaretide game engine",function(){
	describe("the game initialization",function(){
		beforeEach(function(){
			// var Jukebox = new Jukebox();s
		})
		it('should create an tileset with the right number of tiles',function(){
			var game = new Squaretide({rows:4,columns:4});
			assert.equal(game.tiles.getRows().length, 4);
			assert.equal(game.tiles.getColumns().length, 4);

		})
	})
})