var UTIL = {};

UTIL.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

UTIL.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

UTIL.Action = {
    DOWN: '',
    DROP: '',
    LEFT: 37,
    PAUSE: 27,
    RIGHT: 39,
    ROTATE: ''
};
