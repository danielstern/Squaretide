function difference(num1,num2){
	return Math.abs(num1-num2);
}

describe("the trampoline",function(){

	describe("calling the callback after the right amount of time",function(){		

		it("should call the callback after the expected amount of time",function(done){
			var callback = sinon.spy();
			var delay = 25;
			var array = [0,1,2];
			var timeStart = new Date().getTime();
			var expectedDelay = delay * array.length;
			var expectedEndTime = timeStart + expectedDelay;
			// var expectedEndTime = timeStart + expectedDelay;

			trampoline(array,callback,delay,function(){
				console.log("diff...",new Date().getTime()-expectedEndTime);
				assert.isTrue(difference(new Date().getTime(),expectedEndTime) < 25);
				done();
			});
		});
	});
	describe("calling the callback",function(){

		it("should call the callback after operating on the elements",function(done){
			var callback = sinon.spy();
			var delay = 5;
			var array = [0,1,2,4,5,6];

			trampoline(array,callback,delay,function(){
				callback();
				assert(callback.called);
				done();
			});
		})

	});

	describe("the amount of times to call the callback",function(){	

		it("should be called once for each item in the array",function(done){
			var callback = sinon.spy();
			var delay = 5;
			var array = [0,1,2,4,5,6];

			trampoline(array,callback,delay,function(){
				assert.equal(callback.callCount, array.length);
				done();
			});
		});
	})


	describe("how delay is determined",function(){
		it("should wait that long if delay is a number",function(done){
			
			var callback = sinon.spy();
			var delay = 25;
			var lastTime;
			var array = [0,1,2];

			trampoline(array,function(elem){
				var timeNow = new Date().getTime();
				if (lastTime) {
					assert.closeTo(timeNow-lastTime,delay,10);
				}
				lastTime = timeNow;
			},delay,function(){
				done();
			});
		});

		it("should wait for what is returned if delay is a function",function(done){
			
			var callback = sinon.spy();
			var delay = function(elem){
				return elem * 0.5;
			};
			var lastTime;
			var array = [50,150,250];
			var startTime = new Date().getTime();
			var nextExpectedTime;

			trampoline(array,function(elem){
				var timeNow = new Date().getTime();
				var expectedDelay = delay(elem);
				if (nextExpectedTime) {
					assert.closeTo(timeNow,nextExpectedTime,10);
				};
				nextExpectedTime = timeNow + expectedDelay;
				lastTime = timeNow;
				lastTime = timeNow;
			},delay,function(){
				var timeNow = new Date().getTime();
				assert.closeTo(timeNow,nextExpectedTime,10);
				done();
			});
		});
	})
})