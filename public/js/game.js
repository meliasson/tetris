var letetris = letetris || {};

/* ROOT */

letetris.game = {};

letetris.game.run = function(canvas) {
    this._init(canvas);
    this._step();
};

letetris.game.resume = function() {
    this._step();
};

letetris.game._init = function(canvas) {
    letetris.model.init();
    letetris.graphicalView.init(canvas);
    letetris.inputController.init(canvas);
};

letetris.game._step = function() {
    var userInput = letetris.inputController.update();
    var modelOutput = letetris.model.update(userInput);

    if (modelOutput.state == 'gameOver') {
        letetris.screenManager.gameScreen.gameOver();
        return;
    }

    if (modelOutput.state == 'gamePaused') {
        letetris.screenManager.gameScreen.gamePaused();
        return;
    }

    letetris.graphicalView.update(modelOutput)
    util.requestAnimationFrame.call(window, letetris.game._step);
};
