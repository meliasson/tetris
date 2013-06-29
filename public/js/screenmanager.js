/* NAMESPACE */

var screenmanager = {};

/* INIT AND RUN */

screenmanager.run = function() {
    this.initConstants();
    this.initVariables();
    this._initMenuScreen();
    this._initHighScoresScreen();
    this._activateMenuScreen();
}

screenmanager.initConstants = function() {
    this._menu = 'menu';
    this._menuNewGame = 'menu-new-game';
    this._menuGameOver = 'menu-game-over';
    this._menuResumeGame = 'menu-resume-game';
    this._menuHighScores = 'menu-high-scores';
    this._highScores = 'high-scores';
    this._highScoresMenu = 'high-scores-menu';
    this._game = 'game';
}

screenmanager.initVariables = function() {
    this._gameState = util.gameState.none;
}

/* MENU SCREEN */

screenmanager._initMenuScreen = function() {
    document.getElementById(this._menuNewGame).addEventListener(
        'click',
        function() {
            screenmanager._gameState = util.gameState.none;
            screenmanager._menuGameElementSelected()
        });
    document.getElementById(this._menuResumeGame).addEventListener(
        'click',
        function() {
            screenmanager._gameState = util.gameState.paused;
            screenmanager._menuGameElementSelected()
        });
    document.getElementById(this._menuHighScores).addEventListener(
        'click',
        this._menuHighScoresElementSelected);
}

screenmanager._activateMenuScreen = function() {
    document.getElementById(this._menu).style.display = 'inline-block';

    if (this._gameState === util.gameState.none) {
        document.getElementById(this._menuGameOver).style.display = 'none';
        document.getElementById(this._menuResumeGame).style.display = 'none';
    }
    else if (this._gameState === util.gameState.paused) {
        document.getElementById(this._menuGameOver).style.display = 'none';
        document.getElementById(this._menuResumeGame).style.display = 'inline';
    }
    else if (this._gameState === util.gameState.over) {
        document.getElementById(this._menuGameOver).style.display = 'inline';
        document.getElementById(this._menuResumeGame).style.display = 'none';
    }
}

screenmanager._deactivateMenuScreen = function() {
    document.getElementById(this._menu).style.display = 'none';
}

screenmanager._menuGameElementSelected = function() {
    this._deactivateMenuScreen();
    this._activateGameScreen();
}

screenmanager._menuHighScoresElementSelected = function() {
    this._deactivateMenuScreen();
    this._activateHighScoreScreen();
}

/* HIGH SCORES SCREEN */

screenmanager._initHighScoresScreen = function() {
    document.getElementById(this._highScoresMenu).addEventListener(
        'click',
        this._highScoresMenuElementSelected);
}

screenmanager._activateHighScoreScreen = function() {
    document.getElementById(this._highScores).style.display = 'inline-block';
}

screenmanager._deactivateHighScoreScreen = function() {
    document.getElementById(this._highScores).style.display = 'none';
}

screenmanager._highScoresMenuElementSelected = function() {
    this._deactivateHighScoreScreen();
    this._activateMenuScreen(screenmanager._gameState);
}

/* GAME SCREEN */

screenmanager.gamePaused = function() {
    this._gameState = util.gameState.paused;
    this._deactivateGameScreen();
    this._activateMenuScreen();
}

screenmanager.gameOver = function() {
    this._gameState = util.gameState.over;
    this._deactivateGameScreen();
    this._activateMenuScreen();
}

screenmanager._activateGameScreen = function() {
    var canvas = document.getElementById(this._game);
    canvas.style.display = 'inline';
    game.run(canvas, this._gameState);
}

screenmanager._deactivateGameScreen = function() {
    document.getElementById(this._game).style.display = 'none';
}
