var util = {};

util.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

util.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

util.shuffleArray = function(array) {
    var counter = array.length;
    var temp;
    var index;

    while (counter > 0) {
        index = (Math.random() * counter--) | 0;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};
