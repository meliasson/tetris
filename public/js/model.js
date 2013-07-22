/* INIT */

var letetris = letetris || {};
letetris.model = {};

letetris.model.init = function() {
    this._grid = this._initGrid();
    this._pieceBag = this._createPieceBag();
    this._activePiece = this._spawnPiece();
    this._tickSpeed = { current: 0.6, decrement: 0.005, min: 0.1 };
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
    if ((now - this._lastTick) / 1000 >= this._tickSpeed.current) {
        this._lastTick = now;
        return true;
    }

    return false;
};

// Makes the active piece a static part of the grid.
// Returns undefined.
letetris.model._freezePiece = function() {
    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                this._grid[offset.row + row][offset.column + col] = piece[row][col];
            }
        }
    }
};

// Removes all filled rows. For each removed row, all rows above are moved down
// one row.
// Returns undefined.
letetris.model._removeFilledRows = function() {
    for (var row = 0; row < util.grid.nrOfRows; row++) {
        if (this._isRowFilled(row)) {
            this._moveAllRowsAboveDownOneRow(row);
            this._clearTopRow();
        }
    }
};

// Determines if row passed as argument is filled.
// Returns true if row is filled, false otherwise.
letetris.model._isRowFilled = function(row) {
    var rowFilled = true;
    for (var col = 0; col < util.grid.nrOfColumns; col++) {
        if (!this._grid[row][col]) {
            rowFilled = false;
        }
    }

    return rowFilled;
};

// Moves all rows above row passed as argument down one row.
// Returns undefined.
letetris.model._moveAllRowsAboveDownOneRow = function(row) {
    for (var rowAbove = row; rowAbove > 0; rowAbove--) {
        for (var col = 0; col < util.grid.nrOfColumns; col++) {
            this._grid[rowAbove][col] = this._grid[rowAbove - 1][col];
        }
    }
};

// Empties the first row.
// Returns undefined.
letetris.model._clearTopRow = function() {
    for (var col = 0; col < util.grid.nrOfColumns; col++) {
        this._grid[0][col] = false;
    }
}

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
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!this._cellAvailable(cell)) {
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

letetris.model._cellAvailable = function(cell) {
    return !(this._cellOutsideGrid(cell) || this._cellOccupied(cell));
};

letetris.model._cellBelowIsAvailable = function(cell) {
    var cellBelow = { row: cell.row + 1, column: cell.column };
    return this._cellAvailable(cellBelow);
};

letetris.model._cellToLeftIsAvailable = function(cell) {
    var cellToLeft = { row: cell.row, column: cell.column - 1 };
    return this._cellAvailable(cellToLeft);
};

letetris.model._cellToRightIsAvailable = function(cell) {
    var cellToRight = { row: cell.row, column: cell.column + 1 };
    return this._cellAvailable(cellToRight);
};

letetris.model._cellOutsideGrid = function(cell) {
    var row = cell.row < 0 || cell.row > util.grid.nrOfRows - 1;
    var col = cell.column < 0 || cell.column > util.grid.nrOfColumns - 1;
    return col || row;
};

letetris.model._cellOccupied = function(cell) {
    return this._grid[cell.row][cell.column];
};

/* PIECE CREATION */

letetris.model._createPieceBag = function() {
    var pieceBag = [];

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.JPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.LPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.IPiece());
    }

    return util.shuffleArray(pieceBag);
};

letetris.model._spawnPiece = function() {
    if (!this._pieceBag.length) {
        this._pieceBag = this._createPieceBag();
    }

    return this._pieceBag.pop();
};

// Creates a new active piece.
// Returns true if created piece doesn't collide with occupied grid cells,
// false otherwise.
letetris.model._spawnSubsequentPiece = function() {
    this._activePiece = this._spawnPiece();

    var piece = this._activePiece.rotation;
    var offset = this._activePiece.position;
    var validSpawn = true;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!this._cellAvailable(cell)) {
                    validSpawn = false;
                }
            }
        }
    }

    return validSpawn;
};

/* PIECE DEFINITIONS */

letetris.model.JPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = util.piece.jPiece;
    this._rotations = [
        [[this._id, 0, 0, 0],
         [this._id, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, this._id, 0],
         [0, this._id, 0, 0],
         [0, this._id, 0, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [this._id, this._id, this._id, 0],
         [0, 0, this._id, 0],
         [0, 0, 0, 0]],

        [[0, this._id, 0, 0],
         [0, this._id, 0, 0],
         [this._id, this._id, 0, 0],
         [0, 0, 0, 0]]
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

letetris.model.LPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = util.piece.lPiece;
    this._rotations = [
        [[0, 0, this._id, 0],
         [this._id, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, this._id, 0],
         [0, 0, this._id, 0],
         [0, 0, this._id, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [this._id, this._id, this._id, 0],
         [this._id, 0, 0, 0],
         [0, 0, 0, 0]],

        [[this._id, 0, 0, 0],
         [this._id, 0, 0, 0],
         [this._id, this._id, 0, 0],
         [0, 0, 0, 0]]
    ];
};

letetris.model.LPiece.prototype = {
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

letetris.model.IPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = util.piece.iPiece;
    this._rotations = [
        [[this._id, this._id, this._id, this._id],
         [0, 0, 0, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, 0, 0],
         [0, this._id, 0, 0],
         [0, this._id, 0, 0],
         [0, this._id, 0, 0]]
    ];
};

letetris.model.IPiece.prototype = {
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
