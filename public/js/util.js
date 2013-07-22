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

util.action = {
    left: 37,
    right: 39,
    rotate: 38,
    drop: 40,
    pause: 27
};

util.grid = {
    cellSize: 20,
    nrOfRows: 20,
    nrOfColumns: 10,
    initialPiecePositionRow: 0,
    initialPiecePositionColumn: 3
};

util.gameState = {
    none: 0,
    paused: 1,
    over: 2
};

util.piece = {
    jPiece: 1,
    lPiece: 2,
    iPiece: 3
};
