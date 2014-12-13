function gameSettingFromLevel(level){
	var colors = 3 + level; // more colors is more hard	
	var comboLength = 3 + level; // more combo is more hard	
	var targetScore = level * 1000; // higher target score is more hard
	var scorePerTile = 100 + 10 * level; // more score per tile is more awesome
	var duration = 100 - level; // shorter duration is more hard
	
}