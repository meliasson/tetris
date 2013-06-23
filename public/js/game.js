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
        UTIL.requestAnimationFrame.call(window, GAME._step);
    }
};

/* MODEL */

GAME.MODEL.init = function() {
    this._grid = [];
    this._activePiece = {
        cell: [0, 0]
    };

    for (var row = 0; row < 20; row++) {
        this._grid[row] = [];
        for (var col = 0; col < 10; col++) {
            this._grid[row][col] = false;
        }
    }

    this._speed = { current: 0.6, decrement: 0.005, min: 0.1 };
    this._lastTick = new Date().getTime();
};

GAME.MODEL.update = function(actions) {
    // Apply gravity
    if (this._pieceShouldFall()) {
        if (this._pieceCanFall()) {
            this._activePiece.cell[0] += 1;
        }
        else {
            this._grid[this._activePiece.cell[0]][this._activePiece.cell[1]] = true;
            this._activePiece = {
                cell: [0, 0]
            };
        }
    }

    //
    // Apply user input
    //

    if (actions[UTIL.Action.ROTATE]) {
	// TODO: Rotate active piece.
    }

    if (actions[UTIL.Action.LEFT]) {
        delete actions[UTIL.Action.LEFT];
        if (this._activePiece.cell[1] > 0 && this._grid[this._activePiece.cell[0]][this._activePiece.cell[1] - 1] === false) {
            this._activePiece.cell[1] -= 1;
        }
    }

    if (actions[UTIL.Action.RIGHT]) {
        delete actions[UTIL.Action.RIGHT];
        if (this._activePiece.cell[1] < 10 && this._grid[this._activePiece.cell[0]][this._activePiece.cell[1] + 1] === false) {
            this._activePiece.cell[1] += 1;
        }
    }

    // Update view
    GAME.VIEW.update(this._grid, this._activePiece);
};

GAME.MODEL._pieceShouldFall = function() {
    var now = new Date().getTime();

    if ((now - this._lastTick) / 1000 >= this._speed.current) {
        this._lastTick = now;
        return true;
    }
    else {
        return false;
    }
};

GAME.MODEL._pieceCanFall = function() {
    var rowsRemain = this._activePiece.cell[0] < 19;
    var nextRowIsFree = this._grid[this._activePiece.cell[0] + 1][this._activePiece.cell[1]] === false;
    return rowsRemain && nextRowIsFree;
}

/* VIEW */

GAME.VIEW.init = function(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._context.fillStyle = '#DDDDDD';
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

GAME.VIEW.update = function(grid, activePiece) {
    // clear canvas
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            if (grid[row][col] === false) {
                this._context.clearRect(col * 20, row * 20, 20, 20);
            }
        }
    }

    // draw active piece
    this._context.fillRect(
        activePiece.cell[1] * 20,
        activePiece.cell[0] * 20,
        20,
        20);

    // draw inactive pieces
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            if (grid[row][col] === true) {
                this._context.fillRect(col * 20, row * 20, 20, 20);
            }
        }
    }
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
