var letetris = letetris || {};

/* ROOT */

letetris.screenManager = {};

letetris.screenManager.run = function() {
    this._initConstants();
    this._initVariables();

    this.menuScreen.init();
    this.gamePausedScreen.init();
    this.gameOverScreen.init();
    this.highScoresScreen.init();

    this.menuScreen.activate();
};

letetris.screenManager._initConstants = function() {
    this._menu = 'menu';
    this._menuGameOver = 'menu-game-over';
    this._menuResumeGame = 'menu-resume-game';
    this._menuHighScores = 'menu-high-scores';
    this._game = 'game';
};

letetris.screenManager._initVariables = function() {
    this._gameState = letetris.model.gameState.none;
};

/* MENU SCREEN */

letetris.screenManager.menuScreen = {};

letetris.screenManager.menuScreen.init = function() {
    document.getElementById('menu-new-game').addEventListener(
        'click',
        function() {
            letetris.screenManager.menuScreen.gameElementSelected();
        });
    document.getElementById('menu-high-scores').addEventListener(
        'click',
        function() {
            letetris.screenManager.menuScreen.highScoresElementSelected();
        });
};

letetris.screenManager.menuScreen.activate = function() {
    document.getElementById('menu').style.display = 'inline-block';
};

letetris.screenManager.menuScreen.deactivate = function() {
    document.getElementById('menu').style.display = 'none';
};

letetris.screenManager.menuScreen.gameElementSelected = function() {
    this.deactivate();
    letetris.screenManager.gameScreen.activate();
};

letetris.screenManager.menuScreen.highScoresElementSelected = function() {
    this.deactivate();
    letetris.screenManager.highScoresScreen.activate();
};

/* GAME PAUSED SCREEN */

letetris.screenManager.gamePausedScreen = {};

letetris.screenManager.gamePausedScreen.init = function() {
    document.getElementById('game-paused-resume-game').addEventListener(
        'click',
        function() {
            letetris.screenManager.gamePausedScreen.resumeGame();
        });
    document.getElementById('game-paused-quit-game').addEventListener(
        'click',
        function() {
            letetris.screenManager.gamePausedScreen.quitGame();
        });
};

letetris.screenManager.gamePausedScreen.activate = function() {
    document.getElementById('game-paused').style.display = 'inline-block';
};

letetris.screenManager.gamePausedScreen.deactivate = function() {
    document.getElementById('game-paused').style.display = 'none';
};

letetris.screenManager.gamePausedScreen.resumeGame = function() {
    this.deactivate();
    letetris.screenManager.gameScreen.reactivate();
};

letetris.screenManager.gamePausedScreen.quitGame = function() {
    this.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* GAME OVER SCREEN */

letetris.screenManager.gameOverScreen = {};

letetris.screenManager.gameOverScreen.init = function() {
    document.getElementById('game-over-menu').addEventListener(
        'click',
        function() {
            letetris.screenManager.gameOverScreen.menuElementSelected()
        });
};

letetris.screenManager.gameOverScreen.activate = function() {
    document.getElementById('game-over').style.display = 'inline-block';
};

letetris.screenManager.gameOverScreen.deactivate = function() {
    document.getElementById('game-over').style.display = 'none';
};

letetris.screenManager.gameOverScreen.menuElementSelected = function() {
    this.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* HIGH SCORES SCREEN */

letetris.screenManager.highScoresScreen = {};

letetris.screenManager.highScoresScreen.init = function() {
    document.getElementById('high-scores-menu').addEventListener(
        'click',
        function() {
            letetris.screenManager.highScoresScreen.menuElementSelected()
        });
};

letetris.screenManager.highScoresScreen.activate = function() {
    document.getElementById('high-scores').style.display = 'inline-block';
};

letetris.screenManager.highScoresScreen.deactivate = function() {
    document.getElementById('high-scores').style.display = 'none';
};

letetris.screenManager.highScoresScreen.menuElementSelected = function() {
    this.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* GAME SCREEN */

letetris.screenManager.gameScreen = {};

letetris.screenManager.gameScreen.activate = function() {
    var canvas = document.getElementById('game');
    canvas.style.display = 'inline';
    letetris.game.run(canvas, this._gameState);
};

letetris.screenManager.gameScreen.reactivate = function() {
    var canvas = document.getElementById('game');
    canvas.style.display = 'inline';
    letetris.game.resume();
};

letetris.screenManager.gameScreen.deactivate = function() {
    document.getElementById('game').style.display = 'none';
};

letetris.screenManager.gameScreen.gamePaused = function() {
    this.deactivate();
    letetris.screenManager.gamePausedScreen.activate();
};

letetris.screenManager.gameScreen.gameOver = function() {
    this.deactivate();
    letetris.screenManager.gameOverScreen.activate();
};
