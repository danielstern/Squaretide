describe("the squaretide game engine",function(){
	var basicGame = {rows:3,columns:3,colors:4,minimumChainLength:3};
 

	describe("starting the game",function(){
		it('should create a tileset with the right number of tiles',function(){
			var game = new Squaretide();
			game.startGame({rows:11,columns:7,colors:7});
			assert.equal(game.tiles.getRows().length, 11);
			assert.equal(game.tiles.getColumns().length, 7);
		});

		it('should reset the state',function(){
			var game = new Squaretide();
			game.startGame();
			game.state.level = 25;
			game.startGame();
			assert.equal(game.state.level,1);
			assert.equal(game.state.score,0);
		})
	});

	describe("pausing the game",function(){
		it("should pause the game",function(done){
			var game = new Squaretide();
			game.startGame();
			game.pause();
			var startGameTime = game.state.gameTime;
			setTimeout(function(){
				assert.equal(game.state.gameTime,startGameTime);
				done();
			},100);
		});

	})
	describe("resuming the game",function(done){
		var game = new Squaretide();
		game.startGame();
		game.pause();
		var startGameTime = game.state.gameTime;
		it("should resume the game",function(done){
			setTimeout(function(){
				game.resume();
			},50);
			setTimeout(function(){
				assert.isTrue(game.state.gameTime>startGameTime);
				done();
			},100);
		});
	})

	describe("Getting a safe color",function(){
		
		describe("when passing it a tile",function(){
			describe("the value it returns",function(){

				it("should return a valid color if one is possible",function(){
					var game = new Squaretide();
					var getSafeColor = game.getSafeColor;
					var tiles = game.tiles;
					game.startGame({rows:3,columns:3,colors:4,minimumChainLength:3});
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