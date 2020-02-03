var letetris = letetris || {};

/* ROOT */

letetris.graphicalView = {};

letetris.graphicalView.init = function(canvas) {
    this._canvas = canvas;
    this._cellSize = canvas.width / 10;
    this._context = canvas.getContext("2d");
    this._context.fillStyle = '#DDDDDD';
    this._context.clearRect(0, 0, canvas.width, canvas.height);
};

letetris.graphicalView.update = function(input) {
    var grid = input.grid;
    var piece = input.piece;

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
    var rotation = piece.rotation;
    var position = piece.position;
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

letetris.graphicalView._fillCell = function(cell, pieceId) {
    switch (pieceId)
    {
    case letetris.model.pieceDefinition.pieceId.iPiece:
        // this._context.fillStyle = '#D95B43';
        this._context.fillStyle = '#00FF00';
        break;
    case letetris.model.pieceDefinition.pieceId.jPiece:
        // this._context.fillStyle = '#ECD078';
        this._context.fillStyle = '#005000';
        break;
    case letetris.model.pieceDefinition.pieceId.lPiece:
        // this._context.fillStyle = '#C02942';
        this._context.fillStyle = '#007000';
        break;
    case letetris.model.pieceDefinition.pieceId.oPiece:
        this._context.fillStyle = '#009000';
        break;
    case letetris.model.pieceDefinition.pieceId.sPiece:
        this._context.fillStyle = '#00B000';
        break;
    case letetris.model.pieceDefinition.pieceId.tPiece:
        this._context.fillStyle = '#00D000';
        break;
    case letetris.model.pieceDefinition.pieceId.zPiece:
        this._context.fillStyle = '#00E800';
        break;
      default:
        // TODO: Let's crash here instead!
        this._context.fillStyle = '#C02942';
        break;
    }

    this._context.fillRect(
        cell.col * this._cellSize,
        cell.row * this._cellSize,
        this._cellSize - 1,
        this._cellSize - 1);
}
