var letetris = letetris || {};

/* ROOT */

letetris.inputController = {};

letetris.inputController.init = function(canvas) {
    //this._canvas = canvas;
    var grid = canvas.getBoundingClientRect();
    this._canvasTop = grid.top;
    this._canvasBottom = grid.bottom;
    this._canvasLeft = grid.left;
    this._canvasRight = grid.right;
    this._keysDown = {};
    this._addKeyEventListeners();
    this._addTouchEventListeners();
};

letetris.inputController._addKeyEventListeners = function() {
    addEventListener(
        "keydown",
        function(e) {
	    letetris.inputController._keysDown[e.keyCode] = true;
        });
};

letetris.inputController._addTouchEventListeners = function() {
    addEventListener(
        'touchstart',
        function(e) {
            letetris.inputController._handleTouchEvent(e);
        });
};

letetris.inputController._handleTouchEvent = function(event) {
    var x = event.touches[0].pageX;
    var y = event.touches[0].pageY;

    if (x < this._canvasLeft && y > this._canvasTop && y < this._canvasBottom) {
        letetris.inputController._keysDown[letetris.model.userInput.action.left] = true;
    }

    if (x > this._canvasRight && y > this._canvasTop && y < this._canvasBottom) {
        letetris.inputController._keysDown[letetris.model.userInput.action.right] = true;
    }

    if (x > this._canvasLeft && x < this._canvasRight && y > this._canvasBottom) {
        letetris.inputController._keysDown[letetris.model.userInput.action.drop] = true;
    }

    if (x > this._canvasLeft && x < this._canvasRight && y > this._canvasTop && y < this._canvasBottom) {
        letetris.inputController._keysDown[letetris.model.userInput.action.rotate] = true;
    }
};

letetris.inputController.update = function() {
    return this._keysDown;
};
