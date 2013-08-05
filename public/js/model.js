var letetris = letetris || {};

/* ROOT */

letetris.model = {};

letetris.model.init = function() {
    this.pieceGeneration.init();
    this.gravity.init();
    this.grid.init();
};

letetris.model.update = function(input) {
    var inputResult = this.userInput.apply(input);

    if (inputResult.state == 'gamePaused') {
        return inputResult;
    }

    return this.gravity.giveChanceToAct();
};

/* GRID */

letetris.model.grid = {};

letetris.model.grid.def = {
    nrOfRows: 20,
    nrOfCols: 10,
    pieceStartPosRow: 0,
    pieceStartPosCol: 3
};

letetris.model.grid.init = function() {
    this.grid = this._initGrid();
    this.piece = letetris.model.pieceGeneration.spawnPiece().piece;
};

letetris.model.grid.cellAvailable = function(cell) {
    return !(this._cellOutsideGrid(cell) || this._cellOccupied(cell));
};

letetris.model.grid.cellBelowIsAvailable = function(cell) {
    var cellBelow = { row: cell.row + 1, col: cell.col };
    return this.cellAvailable(cellBelow);
};

letetris.model.grid.cellToLeftIsAvailable = function(cell) {
    var cellToLeft = { row: cell.row, col: cell.col - 1 };
    return this.cellAvailable(cellToLeft);
};

letetris.model.grid.cellToRightIsAvailable = function(cell) {
    var cellToRight = { row: cell.row, col: cell.col + 1 };
    return this.cellAvailable(cellToRight);
};

letetris.model.grid._cellOutsideGrid = function(cell) {
    var aboveFirstRow = cell.row < 0;
    var belowLastRow = cell.row > letetris.model.grid.def.nrOfRows - 1;
    var beforeFirstCol = cell.col < 0;
    var afterLastCol = cell.col > letetris.model.grid.def.nrOfCols - 1;
    return aboveFirstRow || belowLastRow || beforeFirstCol || afterLastCol;
};

letetris.model.grid._cellOccupied = function(cell) {
    return this.grid[cell.row][cell.col];
};

letetris.model.grid._initGrid = function() {
    var grid = [];
    for (var row = 0; row < letetris.model.grid.def.nrOfRows; row++) {
        grid[row] = [];
        for (var col = 0; col < letetris.model.grid.def.nrOfCols; col++) {
            grid[row][col] = 0;
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

letetris.model.gravity.giveChanceToAct = function() {
    if (this._shouldAct()) {
        return this._act();
    }
    else {
        return {
            state: 'gameAlive',
            grid: letetris.model.grid.grid,
            piece: letetris.model.grid.piece };
    }

    return true;
};

letetris.model.gravity.forceActOnNextChance = function() {
    this._lastTick = 0;
}

letetris.model.gravity._shouldAct = function() {
    var now = new Date().getTime();
    var secondsElapsedSinceLastTick = (now - this._lastTick) / 1000;
    if (secondsElapsedSinceLastTick >= this._tickSpeed.current) {
        this._lastTick = now;
        return true;
    }

    return false;
};

letetris.model.gravity._act = function() {
    if (letetris.model.pieceMovement.movePieceDown()) {
        return {
            state: 'gameAlive',
            grid: letetris.model.grid.grid,
            piece: letetris.model.grid.piece };
    }

    this._freezePiece();
    this._removeFilledRows();

    var spawn = letetris.model.pieceGeneration.spawnPiece();
    if (spawn.validSpawn) {
        letetris.model.grid.piece = spawn.piece;
        return {
            state: 'gameAlive',
            grid: letetris.model.grid.grid,
            piece: letetris.model.grid.piece };
    }
    else {
        return {
            state: 'gameOver',
            grid: letetris.model.grid.grid,
            piece: letetris.model.grid.piece };
    }
};

letetris.model.gravity._freezePiece = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var gridRow = offset.row + row;
                var gridCol = offset.col + col;
                letetris.model.grid.grid[gridRow][gridCol] = piece[row][col];
            }
        }
    }
};

letetris.model.gravity._removeFilledRows = function() {
    for (var row = 0; row < letetris.model.grid.def.nrOfRows; row++) {
        if (this._isRowFilled(row)) {
            this._moveAllRowsAboveDownOneRow(row);
            this._clearTopRow();
        }
    }
};

letetris.model.gravity._isRowFilled = function(row) {
    for (var col = 0; col < letetris.model.grid.def.nrOfCols; col++) {
        if (!letetris.model.grid.grid[row][col]) {
            return false;
        }
    }

    return true;
};

letetris.model.gravity._moveAllRowsAboveDownOneRow = function(row) {
    for (var r = row; r > 0; r--) {
        for (var c = 0; c < letetris.model.grid.def.nrOfCols; c++) {
            letetris.model.grid.grid[r][c] = letetris.model.grid.grid[r - 1][c];
        }
    }
};

letetris.model.gravity._clearTopRow = function() {
    for (var col = 0; col < letetris.model.grid.def.nrOfCols; col++) {
        letetris.model.grid.grid[0][col] = false;
    }
}

/* USER INPUT */

letetris.model.userInput = {};

letetris.model.userInput.action = {
    left: 37,
    right: 39,
    rotate: 38,
    drop: 40,
    pause: 27
};

letetris.model.userInput.apply = function(actions) {
    if (actions[this.action.pause]) {
        delete actions[this.action.pause];
        return { state: 'gamePaused' };
    }

    if (actions[this.action.rotate]) {
        delete actions[this.action.rotate];
        letetris.model.pieceMovement.rotatePiece();
    }

    if (actions[this.action.left]) {
        delete actions[this.action.left];
        letetris.model.pieceMovement.movePieceLeft();
    }

    if (actions[this.action.right]) {
        delete actions[this.action.right];
        letetris.model.pieceMovement.movePieceRight();
    }

    if (actions[this.action.drop]) {
        delete actions[this.action.drop];
        letetris.model.pieceMovement.dropPiece();
    }

    return { state: 'gameAlive' };
};

/* PIECE MOVEMENT */

letetris.model.pieceMovement = {};

letetris.model.pieceMovement.rotatePiece = function() {
    letetris.model.grid.piece.toNextRotation();

    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;
    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    col: offset.col + col
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

letetris.model.pieceMovement.dropPiece = function() {
    var validMove = false;
    do {
        validMove = this.movePieceDown();
    } while (validMove)

    letetris.model.gravity.forceActOnNextChance();
}

letetris.model.pieceMovement.movePieceDown = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    col: offset.col + col
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

letetris.model.pieceMovement.movePieceLeft = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    col: offset.col + col
                };

                if (!letetris.model.grid.cellToLeftIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        letetris.model.grid.piece.position.col -= 1;
    }

    return validMove;
}

letetris.model.pieceMovement.movePieceRight = function() {
    var piece = letetris.model.grid.piece.rotation;
    var offset = letetris.model.grid.piece.position;
    var validMove = true;

    for (var row = 0; row < piece.length; row++) {
        for (var col = 0; col < piece[0].length; col++) {
            if (piece[row][col]) {
                var cell = {
                    row: offset.row + row,
                    col: offset.col + col
                };

                if (!letetris.model.grid.cellToRightIsAvailable(cell)) {
                    validMove = false;
                }
            }
        }
    }

    if (validMove) {
        letetris.model.grid.piece.position.col += 1;
    }

    return validMove;
}

/* PIECE GENERATION */

letetris.model.pieceGeneration = {};

letetris.model.pieceGeneration.init = function() {
    this._pieceBag = this._createPieceBag();
};

letetris.model.pieceGeneration.spawnPiece = function() {
    if (!this._pieceBag.length) {
        this._pieceBag = this._createPieceBag();
    }

    var piece = this._pieceBag.pop();
    for (var row = 0; row < piece.rotation.length; row++) {
        for (var col = 0; col < piece.rotation[0].length; col++) {
            if (piece.rotation[row][col]) {
                var cell = {
                    row: piece.position.row + row,
                    col: piece.position.col + col
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

letetris.model.pieceGeneration._createPieceBag = function() {
    var pieceBag = [];

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.IPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.JPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.LPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.OPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.SPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.TPiece());
    }

    for (var i = 0; i < 4; i++) {
        pieceBag.push(new letetris.model.pieceDefinition.ZPiece());
    }

    return util.shuffleArray(pieceBag);
};

/* PIECE DEFINITION */

letetris.model.pieceDefinition = {};

letetris.model.pieceDefinition.pieceId = {
    iPiece: 1,
    jPiece: 2,
    lPiece: 3,
    oPiece: 4,
    sPiece: 5,
    tPiece: 6,
    zPiece: 7
};

letetris.model.pieceDefinition.JPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.jPiece;
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

letetris.model.pieceDefinition.JPiece.prototype = {
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

letetris.model.pieceDefinition.LPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.lPiece;
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

letetris.model.pieceDefinition.LPiece.prototype = {
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

letetris.model.pieceDefinition.IPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.iPiece;
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

letetris.model.pieceDefinition.IPiece.prototype = {
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

letetris.model.pieceDefinition.OPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.oPiece;
    this._rotations = [
        [[0, this._id, this._id, 0],
         [0, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]]
    ];
};

letetris.model.pieceDefinition.OPiece.prototype = {
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

letetris.model.pieceDefinition.SPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.sPiece;
    this._rotations = [
        [[0, this._id, this._id, 0, 0],
         [this._id, this._id, 0, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[this._id, 0, 0, 0],
         [this._id, this._id, 0, 0],
         [0, this._id, 0, 0],
         [0, 0, 0, 0]]
    ];
};

letetris.model.pieceDefinition.SPiece.prototype = {
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

letetris.model.pieceDefinition.ZPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.zPiece;
    this._rotations = [
        [[this._id, this._id, 0, 0],
         [0, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, 0, 0],
         [this._id, this._id, 0, 0],
         [this._id, 0, 0, 0],
         [0, 0, 0, 0]]
    ];
};

letetris.model.pieceDefinition.ZPiece.prototype = {
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

letetris.model.pieceDefinition.TPiece = function() {
    this.position = {
        row: letetris.model.grid.def.pieceStartPosRow,
        col: letetris.model.grid.def.pieceStartPosCol };
    this._id = letetris.model.pieceDefinition.pieceId.tPiece;
    this._rotations = [
        [[0, this._id, 0, 0],
         [this._id, this._id, this._id, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, 0, 0],
         [0, this._id, this._id, 0],
         [0, this._id, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [this._id, this._id, this._id, 0],
         [0, this._id, 0, 0],
         [0, 0, 0, 0]],

        [[0, this._id, 0, 0],
         [this._id, this._id, 0, 0],
         [0, this._id, 0, 0],
         [0, 0, 0, 0]],
    ];
};

letetris.model.pieceDefinition.TPiece.prototype = {
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
