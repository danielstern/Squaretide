function difference(num1,num2){
	return Math.abs(num1-num2);
}

describe("the trampoline",function(){

	it("should call the callback after operating on the elements",function(done){
		var callback = sinon.spy();
		var delay = 5;
		var array = [0,1,2,4,5,6];

		trampoline(array,callback,delay,function(){
			done();
		});
	});

	it("should be called once for each item in the array",function(done){
		var callback = sinon.spy();
		var delay = 5;
		var array = [0,1,2,4,5,6];

		trampoline(array,callback,delay,function(){
			assert.equal(spy.callCount, array.length);
			done();
		});
	});

	it("should call the callback after the expected amount of time",function(done){
		var callback = sinon.spy();
		var delay = 100;
		var array = [0,1,2,4,5];
		var expectedTotalDelay = delay * array.length;
		var timeStart = new Date().getTime();

		trampoline(array,callback,delay,function(){
			var timeEnd = new Date().getTime();
			var diff = timeEnd - timeStart;
			console.log("Diff?",diff);
			assert.closeTo(diff, expectedTotalDelay,50,"Total delay");
			done();
		});
	});

	describe("how delay is determined",function(){
		it("should wait that long if delay is a number",function(done){
			
			var callback = sinon.spy();
			var delay = 100;
			var lastTime = new Date().getTime();
			var array = [0,1,2];
			var expectedTotalDelay = delay * array.length;


			trampoline(array,function(elem){
				var timeNow = new Date().getTime();
				callback(timeNow - lastTime);
				lastTime = timeNow;
			},delay,function(){
				// assert.equal(spy.callCount, array.length);
				// assert.equal(spy.callCount, array.length);
				console.log("Spy oh my?",callback.args)
				done();
			});
		});
		it("should wait the duration of the number returned by the delay function if it's a function")
	})
})