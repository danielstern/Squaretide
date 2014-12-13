function trampoline(array,iterator,delay,callback) {

    function bounce() {
        var delayValue;
        var elem = array[0];

        if (typeof delay === 'function') {
            delayValue = delay(elem);
        } else {
            delayValue = delay;
        }
        iterator(elem);

        if (array[1]) {
            setTimeout(bounce, delayValue);
            array.shift();
        } else {
            setTimeout(callback, delayValue);
        }
    }

    bounce();
}