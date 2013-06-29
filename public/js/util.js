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

util.action = {
    left: 37,
    right: 39,
    rotate: 38,
    drop: 40,
    pause: 27
};

util.grid = {
    nrOfRows: 20,
    nrOfColumns: 10,
    cellSize: 20
};

util.gameState = {
    none: 0,
    paused: 1,
    over: 2
};
