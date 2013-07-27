/* NAMESPACE */

var game = {
    view: {},
    controller: {}
};

/* GAME */

game.run = function(canvas, state) {
    if (state == letetris.model.gameState.none || state == letetris.model.gameState.over) {
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
    this._cellSize = 20;
    this._context = canvas.getContext("2d");
    this._context.fillStyle = '#DDDDDD';
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

game.view.update = function(grid, activePiece) {
    // clear canvas
    for (var row = 0; row < letetris.model.grid.def.nrOfRows; row++) {
        for (var col = 0; col < letetris.model.grid.def.nrOfCols; col++) {
            if (!grid[row][col]) {
                this._context.clearRect(
                    col * this._cellSize,
                    row * this._cellSize,
                    this._cellSize,
                    this._cellSize);
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
                    col: position.col + col
                }

                this._fillCell(cell, pieceId);
            }
        }
    }

    // draw filled cells
    for (var row = 0; row < letetris.model.grid.def.nrOfRows; row++) {
        for (var col = 0; col < letetris.model.grid.def.nrOfCols; col++) {
            if (grid[row][col]) {
                var pieceId = grid[row][col];
                var cell = {
                    row: row,
                    col: col
                }

                this._fillCell(cell, pieceId);
            }
        }
    }
};

game.view._fillCell = function(cell, pieceId) {
    switch (pieceId)
    {
    case letetris.model.pieceDef.pieceId.iPiece:
        this._context.fillStyle = '#D95B43';
        break;
    case letetris.model.pieceDef.pieceId.jPiece:
        this._context.fillStyle = '#ECD078';
        break;
    case letetris.model.pieceDef.pieceId.lPiece:
        this._context.fillStyle = '#C02942';
        break;
    case letetris.model.pieceDef.pieceId.oPiece:
        this._context.fillStyle = '#D1F2A5';
        break;
    case letetris.model.pieceDef.pieceId.sPiece:
        this._context.fillStyle = '#7894EC';
        break;
    case letetris.model.pieceDef.pieceId.tPiece:
        this._context.fillStyle = '#F56991';
        break;
    case letetris.model.pieceDef.pieceId.zPiece:
        this._context.fillStyle = '#53777A';
        break;
    default:
        this._context.fillStyle = '#C02942';
        break;
    }

    this._context.fillRect(
        cell.col * this._cellSize,
        cell.row * this._cellSize,
        this._cellSize,
        this._cellSize);
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
