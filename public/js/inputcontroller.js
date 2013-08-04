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

//    addEventListener(
//        "keyup",
//        function(e) {
//	    delete game.controller._keysDown[e.keyCode];
//        });
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
                letetris.inputController._keysDown[util.action.left] = true;
            }

            if (x > right && y > top && y < bottom) {
                letetris.inputController._keysDown[util.action.right] = true;
            }

            if (x > left && x < right && y > bottom) {
                letetris.inputController._keysDown[util.action.drop] = true;
            }

            if (x > left && x < right && y > top && y < bottom) {
                letetris.inputController._keysDown[util.action.rotate] = true;
            }
        });
};

letetris.inputController.update = function() {
    return this._keysDown;
};
