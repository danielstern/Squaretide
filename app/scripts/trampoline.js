function trampoline(array,iterator,delay,callback) {
    function bounce() {
        elem = array[0];
        iterator(elem);

        if (array[1]) {
            setTimeout(bounce, delay);
            array.shift();
        } else {
            setTimeout(callback, delay);
        }
    }

    bounce();
}