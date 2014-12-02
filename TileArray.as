package 
{

	public class TileArray extends Array
	{	
		private var _originalArraysPizza:Array;
		public function TileArray(array:Array) {
			array.forEach(function(elem) {
				this.push(elem);
			})
		}
	}
	
}