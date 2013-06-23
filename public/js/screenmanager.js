/* NAMESPACE */

var SCREENMANAGER = {};

/* CONSTANTS */

SCREENMANAGER._MENU = 'menu';
SCREENMANAGER._MENU_NEW_GAME = 'menu-new-game';
SCREENMANAGER._MENU_RESUME_GAME = 'menu-resume-game';
SCREENMANAGER._MENU_HIGH_SCORES = 'menu-high-scores';

SCREENMANAGER._HIGH_SCORES = 'high-scores';
SCREENMANAGER._HIGH_SCORES_MENU = 'high-scores-menu';

SCREENMANAGER._GAME = 'game';

/* VARIABLES */

SCREENMANAGER._newGame = true;

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
        function() { SCREENMANAGER._menuGameElementSelected(true) });
    document.getElementById(this._MENU_RESUME_GAME).addEventListener(
        'click',
        function() { SCREENMANAGER._menuGameElementSelected(false) });
    document.getElementById(this._MENU_HIGH_SCORES).addEventListener(
        'click',
        this._menuHighScoresElementSelected);
}

SCREENMANAGER._activateMenuScreen = function() {
    document.getElementById(this._MENU).style.display = 'inline-block';

    if (SCREENMANAGER._newGame) {
        document.getElementById(this._MENU_RESUME_GAME).style.display = 'none';
    }
    else {
        document.getElementById(this._MENU_RESUME_GAME).style.display = 'inline';
    }
}

SCREENMANAGER._deactivateMenuScreen = function() {
    document.getElementById(this._MENU).style.display = 'none';
}

SCREENMANAGER._menuGameElementSelected = function(newGame) {
    SCREENMANAGER._newGame = newGame;

    SCREENMANAGER._deactivateMenuScreen();
    SCREENMANAGER._activateGameScreen(newGame);
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
    this._activateMenuScreen(SCREENMANAGER._newGame);
}

/* GAME SCREEN */

SCREENMANAGER._activateGameScreen = function() {
    var canvas = document.getElementById(this._GAME);
    canvas.style.display = 'inline';
    GAME.run(canvas, this._newGame);
}

SCREENMANAGER._deactivateGameScreen = function() {
    document.getElementById(this._GAME).style.display = 'none';
}

SCREENMANAGER._gamePaused = function() {
    this._newGame = false;
    this._deactivateGameScreen();
    this._activateMenuScreen();
}
