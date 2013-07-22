/* NAMESPACE */

var game = {
    view: {},
    controller: {}
};

/* GAME */

game.run = function(canvas, state) {
    if (state == util.gameState.none || state == util.gameState.over) {
        game._init(canvas);
    }

    game._step(canvas);
};

game._init = function(canvas) {
    letetris.model.init();
    game.view.init(canvas);
    game.controller.init(canvas);
};

game._step = function() {
    var proceed = game.controller.update();
    if (proceed) {
        util.requestAnimationFrame.call(window, game._step);
    }
};

/* VIEW */

game.view.init = function(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._context.fillStyle = '#DDDDDD';
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

game.view.update = function(grid, activePiece) {
    // clear canvas
    for (var row = 0; row < util.grid.nrOfRows; row++) {
        for (var col = 0; col < util.grid.nrOfColumns; col++) {
            if (!grid[row][col]) {
                this._context.clearRect(col * 20, row * 20, 20, 20);
            }
        }
    }

    // draw active piece
    var rotation = activePiece.rotation;
    var position = activePiece.position;
    for (var row = 0; row < rotation.length; row++) {
        for (var col = 0; col < rotation[0].length; col++) {
            if (rotation[row][col]) {
                var pieceId = rotation[row][col];
                var cell = {
                    row: position.row + row,
                    column: position.column + col
                }

                this._fillCell(cell, pieceId);
            }
        }
    }

    // draw inactive pieces
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            if (grid[row][col]) {
                var pieceId = grid[row][col];
                var cell = {
                    row: row,
                    column: col
                }

                this._fillCell(cell, pieceId);
            }
        }
    }
};

game.view._fillCell = function(cell, pieceId) {
    switch (pieceId)
    {
    case letetris.model.piecedefinitions.pieceId.jPiece:
        this._context.fillStyle = '#ECD078';
        break;
    case letetris.model.piecedefinitions.pieceId.lPiece:
        this._context.fillStyle = '#C02942';
        break;
    case letetris.model.piecedefinitions.pieceId.iPiece:
        this._context.fillStyle = '#D95B43';
        break;
    case letetris.model.piecedefinitions.pieceId.oPiece:
        this._context.fillStyle = '#542437';
        break;
    default:
        this._context.fillStyle = '#C02942';
        break;
    }

    this._context.fillRect(
        cell.column * util.grid.cellSize,
        cell.row * util.grid.cellSize,
        util.grid.cellSize,
        util.grid.cellSize);
}

/* CONTROLLER */

game.controller.init = function(canvas) {
    this._canvas = canvas;
    this._keysDown = {};

    addEventListener(
        "keydown",
        function(e) {
	    game.controller._keysDown[e.keyCode] = true;
        });

    addEventListener(
        "keyup",
        function(e) {
	    delete game.controller._keysDown[e.keyCode];
        });

    addEventListener(
        'touchstart',
        function(e) {
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            var grid = game.controller._canvas.getBoundingClientRect();
            var top = grid.top;
            var bottom = grid.bottom;
            var left = grid.left;
            var right = grid.right;

            if (x < left && y > top && y < bottom) {
                game.controller._keysDown[util.action.left] = true;
            }

            if (x > right && y > top && y < bottom) {
                game.controller._keysDown[util.action.right] = true;
            }

            if (x > left && x < right && y > bottom) {
                game.controller._keysDown[util.action.drop] = true;
            }

            if (x > left && x < right && y > top && y < bottom) {
                game.controller._keysDown[util.action.rotate] = true;
            }
        });
};

game.controller.update = function() {
    if (this._keysDown[util.action.pause]) {
        screenmanager.gamePaused();
        return false;
    }

    if (letetris.model.update(this._keysDown) === false) {
        screenmanager.gameOver();
        return false;
    }

    return true;
};
