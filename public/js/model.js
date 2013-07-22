/* ROOT */

var letetris = letetris || {};

letetris.model = {};

letetris.model.init = function() {
    this.piecegeneration.init();
    this.gravity.init();
    this.grid.init();
};

letetris.model.update = function(actions) {
    var proceed = this.gravity.giveGravityChanceToAct();
    if (proceed) {
        this.userinput.applyUserInput(actions);
        game.view.update(this.grid.grid, this.grid.piece);
        return true;
    }

    return false;
};

/* GRID */

letetris.model.grid = {};

letetris.model.grid.init = function() {
    this.grid = this._initGrid();
    this.piece = letetris.model.piecegeneration.spawnPiece().piece;

};

letetris.model.grid.cellAvailable = function(cell) {
    return !(this._cellOutsideGrid(cell) || this._cellOccupied(cell));
};

letetris.model.grid.cellBelowIsAvailable = function(cell) {
    var cellBelow = { row: cell.row + 1, column: cell.column };
    return this.cellAvailable(cellBelow);
};

letetris.model.grid.cellToLeftIsAvailable = function(cell) {
    var cellToLeft = { row: cell.row, column: cell.column - 1 };
    return this.cellAvailable(cellToLeft);
};

letetris.model.grid.cellToRightIsAvailable = function(cell) {
    var cellToRight = { row: cell.row, column: cell.column + 1 };
    return this.cellAvailable(cellToRight);
};

letetris.model.grid._cellOutsideGrid = function(cell) {
    var row = cell.row < 0 || cell.row > util.grid.nrOfRows - 1;
    var col = cell.column < 0 || cell.column > util.grid.nrOfColumns - 1;
    return col || row;
};

letetris.model.grid._cellOccupied = function(cell) {
    return this.grid[cell.row][cell.column];
};

letetris.model.grid._initGrid = function() {
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

letetris.model.gravity = {};

letetris.model.gravity.init = function() {
    this._tickSpeed = { current: 0.6, decrement: 0.005, min: 0.1 };
    this._lastTick = new Date().getTime();
};

letetris.model.gravity.giveGravityChanceToAct = function() {
    if (this._gravityShouldAct()) {
        if (!letetris.model.piecemovement.movePieceDown()) {
            this._freezePiece();
            this._removeFilledRows();
            var spawn = letetris.model.piecegeneration.spawnPiece();
            if (spawn.validSpawn) {
                letetris.model.grid.piece = spawn.piece;
            }
            else {
                return false;
            }
        }
    }

    return true;
};

letetris.model.gravity.forceGravityToActOnNextChance = function() {
    this._lastTick = 0;
}

letetris.model.gravity._gravityShouldAct = function() {
    var now = new Date().getTime();
    var secondsElapsedSinceLastTick = (now - this._lastTick) / 1000;
    if (secondsElapsedSinceLastTick >= this._tickSpeed.current) {
        this._lastTick = now;
        return true;
    }

    return false;
};

letetris.model.gravity._freezePiece = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var gridRow = offset.row + row;
                var gridCol = offset.column + col;
                letetris.model.grid.grid[gridRow][gridCol] = piece[row][col];
            }
        }
    }
};

letetris.model.gravity._removeFilledRows = function() {
    for (var row = 0; row < util.grid.nrOfRows; row++) {
        if (this._isRowFilled(row)) {
            this._moveAllRowsAboveDownOneRow(row);
            this._clearTopRow();
        }
    }
};

letetris.model.gravity._isRowFilled = function(row) {
    for (var col = 0; col < util.grid.nrOfColumns; col++) {
        if (!letetris.model.grid.grid[row][col]) {
            return false;
        }
    }

    return true;
};

letetris.model.gravity._moveAllRowsAboveDownOneRow = function(row) {
    for (var r = row; r > 0; r--) {
        for (var c = 0; c < util.grid.nrOfColumns; c++) {
            letetris.model.grid.grid[r][c] = letetris.model.grid.grid[r - 1][c];
        }
    }
};

letetris.model.gravity._clearTopRow = function() {
    for (var col = 0; col < util.grid.nrOfColumns; col++) {
        letetris.model.grid.grid[0][col] = false;
    }
}

/* USER INPUT */

letetris.model.userinput = {};

letetris.model.userinput.applyUserInput = function(actions) {
    if (actions[util.action.rotate]) {
        delete actions[util.action.rotate];
        letetris.model.piecemovement.rotatePiece();
    }

    if (actions[util.action.left]) {
        delete actions[util.action.left];
        letetris.model.piecemovement.movePieceLeft();
    }

    if (actions[util.action.right]) {
        delete actions[util.action.right];
        letetris.model.piecemovement.movePieceRight();
    }

    if (actions[util.action.drop]) {
        delete actions[util.action.drop];
        letetris.model.piecemovement.dropPiece();
    }
};

/* PIECE MOVEMENT */

letetris.model.piecemovement = {};

letetris.model.piecemovement.rotatePiece = function() {
    letetris.model.grid.piece.toNextRotation();

    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!letetris.model.grid.cellAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (!validMove) {
        letetris.model.grid.piece.toPreviousRotation();
    }

    return validMove;
};

letetris.model.piecemovement.dropPiece = function() {
    var validMove = false;
    do {
        validMove = this.movePieceDown();
    } while (validMove)

    letetris.model.gravity.forceGravityToActOnNextChance();
}

letetris.model.piecemovement.movePieceDown = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!letetris.model.grid.cellBelowIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        letetris.model.grid.piece.position.row += 1;
    }

    return validMove;
}

letetris.model.piecemovement.movePieceLeft = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!letetris.model.grid.cellToLeftIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        letetris.model.grid.piece.position.column -= 1;
    }

    return validMove;
}

letetris.model.piecemovement.movePieceRight = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    column: offset.column + col
                };

                if (!letetris.model.grid.cellToRightIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        letetris.model.grid.piece.position.column += 1;
    }

    return validMove;
}

/* PIECE GENERATION */

letetris.model.piecegeneration = {};

letetris.model.piecegeneration.init = function() {
    this._pieceBag = this._createPieceBag();
};

letetris.model.piecegeneration.spawnPiece = function() {
    if (!this._pieceBag.length) {
        this._pieceBag = this._createPieceBag();
    }

    var piece = this._pieceBag.pop();
    for (var row = 0; row < piece.rotation.length; row++) {
        for (var col = 0; col < piece.rotation[0].length; col++) {
            if (piece.rotation[row][col]) {
                var cell = {
                    row: piece.position.row + row,
                    column: piece.position.column + col
                };

                if (!letetris.model.grid.cellAvailable(cell)) {
                    return {
                        validSpawn: false,
                        piece: null };
                }
            }
        }
    }

    return {
        validSpawn: true,
        piece: piece };
};

letetris.model.piecegeneration._createPieceBag = function() {
    var pieceBag = [];

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.piecedefinitions.JPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.piecedefinitions.LPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.piecedefinitions.IPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.piecedefinitions.OPiece());
    }

    return util.shuffleArray(pieceBag);
};

/* PIECE DEFINITIONS */

letetris.model.piecedefinitions = {};

letetris.model.piecedefinitions.pieceId = {
    jPiece: 1,
    lPiece: 2,
    iPiece: 3,
    oPiece: 4
};

letetris.model.piecedefinitions.JPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = letetris.model.piecedefinitions.pieceId.jPiece;
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

letetris.model.piecedefinitions.JPiece.prototype = {
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

letetris.model.piecedefinitions.LPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = letetris.model.piecedefinitions.pieceId.lPiece;
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

letetris.model.piecedefinitions.LPiece.prototype = {
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

letetris.model.piecedefinitions.IPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = letetris.model.piecedefinitions.pieceId.iPiece;
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

letetris.model.piecedefinitions.IPiece.prototype = {
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

letetris.model.piecedefinitions.OPiece = function() {
    this.position = {
        row: util.grid.initialPiecePositionRow,
        column: util.grid.initialPiecePositionColumn };
    this._id = letetris.model.piecedefinitions.pieceId.oPiece;
    this._rotations = [
        [[0, this._id, this._id, 0],
         [0, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]]
    ];
};

letetris.model.piecedefinitions.OPiece.prototype = {
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
