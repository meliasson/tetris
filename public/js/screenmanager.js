/* NAMESPACE */

var SCREENMANAGER = {};

/* CONSTANTS */

SCREENMANAGER._MENU = 'menu';
SCREENMANAGER._MENU_NEW_GAME = 'menu-new-game';
SCREENMANAGER._MENU_GAME_OVER = 'menu-game-over';
SCREENMANAGER._MENU_RESUME_GAME = 'menu-resume-game';
SCREENMANAGER._MENU_HIGH_SCORES = 'menu-high-scores';

SCREENMANAGER._HIGH_SCORES = 'high-scores';
SCREENMANAGER._HIGH_SCORES_MENU = 'high-scores-menu';

SCREENMANAGER._GAME = 'game';

/* VARIABLES */

SCREENMANAGER._gameState = 0;

/* INIT AND RUN */

SCREENMANAGER.run = function() {
    SCREENMANAGER._initMenuScreen();
    SCREENMANAGER._initHighScoresScreen();
    SCREENMANAGER._activateMenuScreen();
}

/* MENU SCREEN */

SCREENMANAGER._initMenuScreen = function() {
    document.getElementById(this._MENU_NEW_GAME).addEventListener(
        'click',
        function() {
            this._gameState = 0;
            SCREENMANAGER._menuGameElementSelected()
        });
    document.getElementById(this._MENU_RESUME_GAME).addEventListener(
        'click',
        function() {
            this._gameState = 1;
            SCREENMANAGER._menuGameElementSelected()
        });
    document.getElementById(this._MENU_HIGH_SCORES).addEventListener(
        'click',
        this._menuHighScoresElementSelected);
}

SCREENMANAGER._activateMenuScreen = function() {
    document.getElementById(this._MENU).style.display = 'inline-block';

    if (SCREENMANAGER._gameState === 0) {
        document.getElementById(this._MENU_GAME_OVER).style.display = 'none';
        document.getElementById(this._MENU_RESUME_GAME).style.display = 'none';
    }
    else if (SCREENMANAGER._gameState === 1) {
        document.getElementById(this._MENU_GAME_OVER).style.display = 'none';
        document.getElementById(this._MENU_RESUME_GAME).style.display = 'inline';
    }
    else if (SCREENMANAGER._gameState === 2) {
        document.getElementById(this._MENU_GAME_OVER).style.display = 'inline';
        document.getElementById(this._MENU_RESUME_GAME).style.display = 'none';
    }
}

SCREENMANAGER._deactivateMenuScreen = function() {
    document.getElementById(this._MENU).style.display = 'none';
}

SCREENMANAGER._menuGameElementSelected = function() {
    SCREENMANAGER._deactivateMenuScreen();
    SCREENMANAGER._activateGameScreen();
}

SCREENMANAGER._menuHighScoresElementSelected = function() {
    SCREENMANAGER._deactivateMenuScreen();
    SCREENMANAGER._activateHighScoreScreen();
}

/* HIGH SCORES SCREEN */

SCREENMANAGER._initHighScoresScreen = function() {
    document.getElementById(this._HIGH_SCORES_MENU).addEventListener(
        'click',
        this._highScoresMenuElementSelected);
}

SCREENMANAGER._activateHighScoreScreen = function() {
    document.getElementById(this._HIGH_SCORES).style.display = 'inline-block';
}

SCREENMANAGER._deactivateHighScoreScreen = function() {
    document.getElementById(this._HIGH_SCORES).style.display = 'none';
}

SCREENMANAGER._highScoresMenuElementSelected = function() {
    this._deactivateHighScoreScreen();
    this._activateMenuScreen(SCREENMANAGER._gameState);
}

/* GAME SCREEN */

SCREENMANAGER.gamePaused = function() {
    this._gameState = 1;
    this._deactivateGameScreen();
    this._activateMenuScreen();
}

SCREENMANAGER.gameOver = function() {
    this._gameState = 2;
    this._deactivateGameScreen();
    this._activateMenuScreen();
}

SCREENMANAGER._activateGameScreen = function() {
    var canvas = document.getElementById(this._GAME);
    canvas.style.display = 'inline';
    GAME.run(canvas, this._gameState);
}

SCREENMANAGER._deactivateGameScreen = function() {
    document.getElementById(this._GAME).style.display = 'none';
}
