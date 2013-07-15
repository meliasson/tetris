/* INIT */

var letetris = letetris || {};
letetris.model = {};

letetris.model.init = function() {
    this._grid = this._initGrid();
    this._activePiece = this._spawnPiece();
    this._speed = { current: 0.6, decrement: 0.005, min: 0.1 };
    this._lastTick = new Date().getTime();
};

letetris.model.update = function(actions) {
    var proceed = this._applyGravity();
    if (proceed) {
        this._applyUserInput(actions);
        game.view.update(this._grid, this._activePiece);
        return true;
    }

    return false;
};

letetris.model._initGrid = function() {
    var grid = [];

    for (var row = 0; row < util.grid.nrOfRows; row++) {
        grid[row] = [];
        for (var col = 0; col < util.grid.nrOfColumns; col++) {
            grid[row][col] = false;
        }
    }

    return grid;
};

/* SHARED */

letetris.model._spawnPiece = function() {
    return new letetris.model.JPiece({ row: 0, column: 3 });
}

/* GRAVITY */

// Attempts to move the active piece down one row. If row is occupied, the piece
// is frozen, filled rows are removed, and a new piece is spawned.
// Returns false if a new piece can't be spawned, and true otherwise.
letetris.model._applyGravity = function() {
    if (this._gravityShouldAct()) {
        if (!this._movePieceDown()) {
            this._freezePiece();
            this._removeFilledRows();
            return this._spawnSubsequentPiece();
        }
    }

    return true;
};

// Determines if it's time for gravity to act.
// Returns true if gravity should act, false otherwise.
letetris.model._gravityShouldAct = function() {
    var now = new Date().getTime();
    if ((now - this._lastTick) / 1000 >= this._speed.current) {
        this._lastTick = now;
        return true;
    }

    return false;
};

letetris.model._freezePiece = function() {
    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                this._grid[offset.row + row][offset.column + col] = true;
            }
        }
    }
};

letetris.model._removeFilledRows = function() {
    for (var row = 0; row < this._grid.length; row++) {
        var rowCleared = true;
        for (var col = 0; col < this._grid[0].length; col++) {
            if (this._grid[row][col]) {
                rowCleared = false;
            }
        }

        if (rowCleared) {
            // remove row ...
        }
    }
};

letetris.model._spawnSubsequentPiece = function() {
    this._activePiece = this._spawnPiece();

    // TODO: Return false if spawned piece collides.
    return true;
};

/* USER INPUT */

letetris.model._applyUserInput = function(actions) {
    if (actions[util.action.rotate]) {
        delete actions[util.action.rotate];
        this._rotatePiece();
    }

    if (actions[util.action.left]) {
        delete actions[util.action.left];
        this._movePieceLeft();
    }

    if (actions[util.action.right]) {
        delete actions[util.action.right];
        this._movePieceRight();
    }

    if (actions[util.action.drop]) {
        delete actions[util.action.drop];
        this._dropPiece();
    }
};

/* PIECE MOVEMENT*/

letetris.model._rotatePiece = function() {
    this._activePiece.toNextRotation();

    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    var validMove = true;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                // TODO: create _cellAvailable(cell) which calls methods
                // _cellOutsideGrid and _cellOccupied instead of the if
                // statements below.

                if (offset.column + col < 0 || offset.column + col > util.grid.nrOfColumns - 1) {
                    validMove = false;
                }

                if (this._grid[offset.row + row][offset.col + col]) {
                    validMove = false;
                }
            }
        }
    }

    if (!validMove) {
        this._activePiece.toPreviousRotation();
    }
};

letetris.model._dropPiece = function() {
    var validMove = false;
    do {
        validMove = this._movePieceDown();
    } while (validMove)

    // Make piece stay where it landed by forcing new tick.
    this._lastTick = 0;
}

letetris.model._movePieceDown = function() {
    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!this._cellBelowIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        this._activePiece.position.row += 1;
    }

    return validMove;
}

letetris.model._movePieceLeft = function() {
    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!this._cellToLeftIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        this._activePiece.position.column -= 1;
    }
}

letetris.model._movePieceRight = function() {
    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!this._cellToRightIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        this._activePiece.position.column += 1;
    }
}

letetris.model._cellBelowIsAvailable = function(cell) {
    return !(this._lastRowReached(cell.row) || this._cellBelowIsOccupied(cell));
};

letetris.model._cellToLeftIsAvailable = function(cell) {
    return !(this._firstColumnReached(cell.column) || this._cellToLeftIsOccupied(cell));
};

letetris.model._cellToRightIsAvailable = function(cell) {
    return !(this._lastColumnReached(cell.column) || this._cellToRightIsOccupied(cell));
};

letetris.model._lastRowReached = function(row) {
    return row === util.grid.nrOfRows - 1;
};

letetris.model._firstColumnReached = function(column) {
    return column == 0;
};

letetris.model._lastColumnReached = function(column) {
    return column == util.grid.nrOfColumns - 1;
};

letetris.model._cellBelowIsOccupied = function(cell) {
    return this._grid[cell.row + 1][cell.column];
};

letetris.model._cellToLeftIsOccupied = function(cell) {
    return this._grid[cell.row][cell.column - 1];
};

letetris.model._cellToRightIsOccupied = function(cell) {
    return this._grid[cell.row][cell.column + 1];
};

/* J PIECE */

letetris.model.JPiece = function(position) {
    this.position = position;
    this._rotations = [
        [[true,  false, false, false],
         [true,  true,  true,  false],
         [false, false, false, false],
         [false, false, false, false]],

        [[false, true,  true,  false],
         [false, true,  false, false],
         [false, true,  false, false],
         [false, false, false, false]],

        [[false, false, false, false],
         [true,  true,  true,  false],
         [false, false, true,  false],
         [false, false, false, false]],

        [[false, true,  false, false],
         [false, true,  false, false],
         [true,  true,  false, false],
         [false, false, false, false]]
    ];
};

letetris.model.JPiece.prototype = {
    get rotation() {
        return this._rotations[0];
    },

    toNextRotation: function() {
        this._rotations.push(this._rotations.shift());
    },

    toPreviousRotation: function() {
        this._rotations.unshift(this._rotations.pop());
    }
};
