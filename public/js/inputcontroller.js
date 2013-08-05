var letetris = letetris || {};

/* ROOT */

letetris.inputController = {};

letetris.inputController.init = function(canvas) {
    this._canvas = canvas;
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

            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            var grid = game.controller._canvas.getBoundingClientRect();
            var top = grid.top;
            var bottom = grid.bottom;
            var left = grid.left;
            var right = grid.right;

            if (x < left && y > top && y < bottom) {
                letetris.inputController._keysDown[letetris.model.userInput.action.left] = true;
            }

            if (x > right && y > top && y < bottom) {
                letetris.inputController._keysDown[letetris.model.userInput.action.right] = true;
            }

            if (x > left && x < right && y > bottom) {
                letetris.inputController._keysDown[letetris.model.userInput.action.drop] = true;
            }

            if (x > left && x < right && y > top && y < bottom) {
                letetris.inputController._keysDown[letetris.model.userInput.action.rotate] = true;
            }
        });
};

letetris.inputController._handleTouchstartEvent = function(event) {
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    var grid = game.controller._canvas.getBoundingClientRect();
    var top = grid.top;
    var bottom = grid.bottom;
    var left = grid.left;
    var right = grid.right;

    if (x < left && y > top && y < bottom) {
        this._keysDown[letetris.model.userInput.action.left] = true;
    }

    if (x > right && y > top && y < bottom) {
        this._keysDown[letetris.model.userInput.action.right] = true;
    }

    if (x > left && x < right && y > bottom) {
        this._keysDown[letetris.model.userInput.action.drop] = true;
    }

    if (x > left && x < right && y > top && y < bottom) {
        this._keysDown[letetris.model.userInput.action.rotate] = true;
    }
};

letetris.inputController.update = function() {
    return this._keysDown;
};
