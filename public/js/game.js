/* NAMESPACE */

var game = {
    model: {},
    view: {},
    controller: {}
};

/* game */

game.run = function(canvas, state) {
    if (state == util.gameState.none || state == util.gameState.over) {
        game._init(canvas);
    }

    game._step(canvas);
};

game._init = function(canvas) {
    game.model.init();
    game.view.init(canvas);
    game.controller.init(canvas);
};

game._step = function() {
    var proceed = game.controller.update();
    if (proceed) {
        util.requestAnimationFrame.call(window, game._step);
    }
};

/* MODEL */

game.model.init = function() {
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

game.model.update = function(actions) {
    // Apply gravity
    if (this._pieceShouldFall()) {
        if (this._pieceCanFall()) {
            this._activePiece.cell[0] += 1;
        }
        else {
            this._grid[this._activePiece.cell[0]][this._activePiece.cell[1]] = true;

            if (this._grid[0][0] == true) {
                return false;
            }

            this._activePiece = {
                cell: [0, 0]
            };
        }
    }

    //
    // Apply user input
    //

    if (actions[util.action.rotate]) {
	// TODO: Rotate active piece.
    }

    if (actions[util.action.left]) {
        delete actions[util.action.left];
        if (this._activePiece.cell[1] > 0 && this._grid[this._activePiece.cell[0]][this._activePiece.cell[1] - 1] === false) {
            this._activePiece.cell[1] -= 1;
        }
    }

    if (actions[util.action.right]) {
        delete actions[util.action.right];
        if (this._activePiece.cell[1] < 10 && this._grid[this._activePiece.cell[0]][this._activePiece.cell[1] + 1] === false) {
            this._activePiece.cell[1] += 1;
        }
    }

    if (actions[util.action.drop]) {
        delete actions[util.action.drop];
        while (this._pieceCanFall()) {
            this._activePiece.cell[0] += 1;
        }

        // Make piece stay where it landed by forcing new tick.
        this._lastTick = 0;
    }

    // Update view
    game.view.update(this._grid, this._activePiece);

    return true;
};

game.model._pieceShouldFall = function() {
    var now = new Date().getTime();

    if ((now - this._lastTick) / 1000 >= this._speed.current) {
        this._lastTick = now;
        return true;
    }
    else {
        return false;
    }
};

game.model._pieceCanFall = function() {
    if (this._activePiece.cell[0] < 19) {
        if (this._grid[this._activePiece.cell[0] + 1][this._activePiece.cell[1]] === false) {
            return true;
        }
    }

    return false;
}

/* VIEW */

game.view.init = function(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._context.fillStyle = '#DDDDDD';
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

game.view.update = function(grid, activePiece) {
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

game.controller.init = function(canvas) {
    this._canvas = canvas;
    this._keysDown = {};
/*
    addEventListener(
        'mousedown',
        function (e) {
            e.preventDefault();
            var rect = game.controller._canvas.getBoundingClientRect();
            if (e.pageX > rect.right && e.pageY > rect.top && e.pageY < rect.bottom) {
                game.controller._keysDown[util.action.right] = true;
            }
        });
*/
    addEventListener(
        "keydown",
        function (e) {
	    game.controller._keysDown[e.keyCode] = true;
        });

    addEventListener(
        "keyup",
        function (e) {
	    delete game.controller._keysDown[e.keyCode];
        });

    addEventListener(
        'touchstart',
        function(e) {
            e.preventDefault();
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            var rect = game.controller._canvas.getBoundingClientRect();

            if (x < rect.left && y > rect.top && y < rect.bottom) {
                game.controller._keysDown[util.action.left] = true;
            }

            if (x > rect.right && y > rect.top && y < rect.bottom) {
                game.controller._keysDown[util.action.right] = true;
            }

            if (x > rect.left && x < rect.right && y > rect.bottom) {
                game.controller._keysDown[util.action.drop] = true;
            }
        });

    window.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

    window.addEventListener('touchend', function(e) {
        e.preventDefault();
    }, false);
}

game.controller.update = function() {
    if (this._keysDown[util.action.pause]) {
        screenmanager.gamePaused();
        return false;
    }

    if (game.model.update(this._keysDown) === false) {
        screenmanager.gameOver();
        return false;
    }

    return true;
}
