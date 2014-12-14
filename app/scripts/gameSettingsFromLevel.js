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
	var chainLength = 3 + everySeventh(level); // more combo is more hard	
	var targetScore = powerOf(level) * 10000; // higher target score is more hard
	var scorePerTile = 100 + 10 * powerOf(level); // more score per tile is more awesome
	var duration = 20 + level * 5; // shorter duration is more hard
	// var duration = 60 - level * 2; // shorter duration is more hard
	var rows = 4 + everyThird(level);
	var columns = 4 + everyThird(level);
	var chainGracePeriod = 15; // doesnt change


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