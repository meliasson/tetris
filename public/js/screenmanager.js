/* NAMESPACE */

var SCREENMANAGER = SCREENMANAGER || {};

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
    document.getElementById(SCREENMANAGER._MENU_NEW_GAME).addEventListener(
        'click',
        SCREENMANAGER._menuGameElementSelected);
    document.getElementById(SCREENMANAGER._MENU_RESUME_GAME).addEventListener(
        'click',
        SCREENMANAGER._menuGameElementSelected);
    document.getElementById(SCREENMANAGER._MENU_HIGH_SCORES).addEventListener(
        'click',
        SCREENMANAGER._menuHighScoresElementSelected);
}

SCREENMANAGER._activateMenuScreen = function() {
    document.getElementById(SCREENMANAGER._MENU).style.display = 'inline-block';

    if (SCREENMANAGER._newGame) {
        document.getElementById(SCREENMANAGER._MENU_RESUME_GAME).style.display = 'none';
    }
    else {
        document.getElementById(SCREENMANAGER._MENU_RESUME_GAME).style.display = 'inline';
    }
}

SCREENMANAGER._deactivateMenuScreen = function() {
    document.getElementById(SCREENMANAGER._MENU).style.display = 'none';
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
    document.getElementById(SCREENMANAGER._HIGH_SCORES_MENU).addEventListener(
        'click',
        SCREENMANAGER._highScoresMenuElementSelected);
}

SCREENMANAGER._activateHighScoreScreen = function() {
    document.getElementById(SCREENMANAGER._HIGH_SCORES).style.display = 'inline-block';
}

SCREENMANAGER._deactivateHighScoreScreen = function() {
    document.getElementById(SCREENMANAGER._HIGH_SCORES).style.display = 'none';
}

SCREENMANAGER._highScoresMenuElementSelected = function() {
    SCREENMANAGER._deactivateHighScoreScreen();
    SCREENMANAGER._activateMenuScreen(SCREENMANAGER._newGame);
}

/* GAME SCREEN */

SCREENMANAGER._activateGameScreen = function() {
    var canvas = document.getElementById(SCREENMANAGER._GAME);
    canvas.style.display = 'inline';
    GAME.run(canvas, SCREENMANAGER._newGame);
}

SCREENMANAGER._deactivateGameScreen = function() {
    document.getElementById(SCREENMANAGER._GAME).style.display = 'none';
}

SCREENMANAGER._gamePaused = function() {
    SCREENMANAGER._newGame = false;

    SCREENMANAGER._deactivateGameScreen();
    SCREENMANAGER._activateMenuScreen();
}
