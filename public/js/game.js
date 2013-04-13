/* NAMESPACE */

var GAME = {
    MODEL: {},
    VIEW: {}
};

/* GAME */

GAME.run = function(canvas, newGame) {
    if (newGame) {
        GAME._init(canvas);
    }

    GAME._step(canvas);
};

GAME._init = function(canvas) {
    GAME.MODEL.init();
    GAME.VIEW.init(canvas);

    // controller

    GAME._keysDown = {};

    addEventListener("keydown", function (e) {
	GAME._keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
	delete GAME._keysDown[e.keyCode];
    }, false);
};

GAME.MODEL.init = function() {
    GAME.MODEL._lastTick = null;

    GAME.MODEL._grid = [];
    for (var row = 0; row < 20; row++) {
        GAME.MODEL._grid[row] = [];
        for (var col = 0; col < 10; col++) {
            GAME.MODEL._grid[row][col] = null;
        }
    }

    GAME._lastTick = new Date().getTime();

    GAME.MODEL._speed = { current: 0.6, decrement: 0.005, min: 0.1 };
};

GAME.MODEL.update = function() {
    var now = new Date().getTime();
    if ((now - GAME.MODEL._lastTick) / 1000 >= GAME.MODEL._speed.current) {
        GAME.MODEL._lastTick = now;
        GAME.VIEW.update();
    }
};

GAME.VIEW.init = function(canvas) {
    GAME.VIEW.canvas = canvas;
    GAME.VIEW.context = canvas.getContext("2d");
    GAME.VIEW.context.clearRect(0, 0, canvas.width, canvas.height);
};

GAME.VIEW.update = function() {
    GAME.VIEW.context.clearRect(0, 0, GAME.VIEW.canvas.width, GAME.VIEW.canvas.height);

    switch(GAME._randomInt(0, 2)) {
    case 0:
        GAME.VIEW.context.fillStyle = '#FF0000';
        break;
    case 1:
        GAME.VIEW.context.fillStyle = '#00FF00';
        break;
    case 2:
        GAME.VIEW.context.fillStyle = '#0000FF';
        break;
    }

    GAME.VIEW.context.fillRect(0, 0, 20, 20);
};

GAME._step = function() {
    if (GAME._keysDown[27]) {
        SCREENMANAGER._gamePaused();
        return;
    }

    GAME.MODEL.update();

    requestAnimationFrame(GAME._step);
};

GAME._colors = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00'
};

GAME._randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
