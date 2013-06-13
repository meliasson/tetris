/* NAMESPACE */

var GAME = {
    MODEL: {},
    VIEW: {},
    CONTROLLER: {}
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
    GAME.CONTROLLER.init();
};

GAME._step = function() {
    var proceed = GAME.CONTROLLER.update();
    if (proceed) {
        requestAnimationFrame(GAME._step);
    }
};

/* MODEL */

GAME.MODEL.init = function() {
    this._grid = [];
    for (var row = 0; row < 20; row++) {
        this._grid[row] = [];
        for (var col = 0; col < 10; col++) {
            this._grid[row][col] = null;
        }
    }

    this._grid[0][4] = true;

    this._speed = { current: 0.6, decrement: 0.005, min: 0.1 };

    this._lastTick = new Date().getTime();
};

GAME.MODEL.update = function(actions) {
    var now = new Date().getTime();
    if ((now - this._lastTick) / 1000 >= this._speed.current) {
        // TODO: Drop active piece.
        this._lastTick = now;
    }

    if (actions[UTIL.Action.ROTATE]) {
	// TODO: Rotate active piece.
    }

    GAME.VIEW.update(this._grid);
};

/* VIEW */

GAME.VIEW.init = function(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

GAME.VIEW.update = function(grid) {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.fillStyle = '#FF0000';

    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            if (grid[row][col]) {
                this._context.fillRect(row * 20, col * 20, 20, 20);
            }
        }
    }

    switch(UTIL.randomInt(0, 2)) {
    case 0:

        break;
    case 1:
        this._context.fillStyle = '#00FF00';
        break;
    case 2:
        this._context.fillStyle = '#0000FF';
        break;
    }

    this._context.fillRect(0, 0, 20, 20);
};

/* CONTROLLER */

GAME.CONTROLLER.init = function() {
    this._keysDown = {};

    addEventListener("keydown", function (e) {
	GAME.CONTROLLER._keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
	delete GAME.CONTROLLER._keysDown[e.keyCode];
    }, false);
}

GAME.CONTROLLER.update = function() {
    if (this._keysDown[UTIL.Action.PAUSE]) {
        SCREENMANAGER._gamePaused();
        return false;
    }

    GAME.MODEL.update(this._keysDown);
    return true;
}
