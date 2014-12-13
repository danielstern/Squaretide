function gameSettingsFromLevel(level){
	function everyThird(level) {
		return Math.floor(level / 3);
	}
	function everyFifth(level) {
		return Math.floor(level / 5);
	}

	function powerOf(level) {
		return Math.pow(level,3/2);
	}



	var colors = 3 + everyThird(level); // more colors is more hard	
	var chainLength = 3 + level; // more combo is more hard	
	var targetScore = powerOf(level) * 1000; // higher target score is more hard
	var scorePerTile = 100 + 10 * powerOf(level); // more score per tile is more awesome
	var duration = 60 - level * 2; // shorter duration is more hard
	var rows = 6; // always 6
	var columns = 6; // ever 6
	var chainGracePeriod = 15; // doesnt change


	var config = {
	    colors: colors,
	    minimumChainLength: chainLength,
	    duration: duration * 1000,
	    pointsPerTile: scorePerTile,
	};

	return config;
}