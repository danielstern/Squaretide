function gameSettingsFromLevel(level){
	function everyThird(level) {
		return Math.floor(level / 3);
	}
	function everyFifth(level) {
		return Math.floor(level / 5);
	}

	function everyFourth(level) {
		return Math.floor(level / 4);
	}

	function everySeventh(level) {
		return Math.floor(level / 7);
	}

	function powerOf(level) {
		return Math.pow(level,9/8);
	}

	var colors = 4 + everyFourth(level); // more colors is more hard	
	var chainLength = 3 + everyFifth(level); // more combo is more hard	
	var targetScore = powerOf(level) * 1000 +  10000 + everyThird(level) * 20000; // higher target score is more hard
	var scorePerTile = 100 + 10 * powerOf(level); // more score per tile is more awesome
	var duration = 30 + 5 * everyThird(level) + 15 * everyFifth(level); // shorter duration is more hard
	var rows = 4 + everyThird(level); // larger grid makes it easier
	var columns = 4 + everyThird(level); 
	var chainGracePeriod = 15; // doesnt change

	/* Test Settings
	var targetScore = powerOf(level) * 1; // higher target score is more hard
	var duration = 1; // shorter duration is more hard
	*/

	var config = {
	    colors: colors,
	    targetScore: targetScore,
	    rows: rows,
	    columns:columns,
	    minimumChainLength: chainLength,
	    duration: duration * 1000,
	    pointsPerTile: scorePerTile,
	};

	return config;
}