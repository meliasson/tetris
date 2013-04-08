/* NAMESPACE */

var LETETRIS = LETETRIS || {};

/* "MAIN" */

LETETRIS.run = function() {
    LETETRIS._activateMenuScreen(true);
}

/* CONSTANTS */

LETETRIS._MENU = 'menu';
LETETRIS._MENU_NEW_GAME = 'menu-new-game';
LETETRIS._MENU_RESUME_GAME = 'menu-resume-game';
LETETRIS._MENU_HIGH_SCORES = 'menu-high-scores';

LETETRIS._HIGH_SCORES = 'high-scores';
LETETRIS._HIGH_SCORES_MENU = 'high-scores-menu';

LETETRIS._GAME = 'game';

/* MENU SCREEN */

LETETRIS._activateMenuScreen = function(newGame) {
    document.getElementById(LETETRIS._MENU).style.display = 'inline-block';

    if (newGame) {
        document.getElementById(LETETRIS._MENU_RESUME_GAME).style.display = 'none';
    }
    else {
        document.getElementById(LETETRIS._MENU_RESUME_GAME).style.display = 'inline';
    }

    document.getElementById(LETETRIS._MENU_NEW_GAME).addEventListener(
        'click',
        LETETRIS._menuNewGameElementSelected);
    document.getElementById(LETETRIS._MENU_RESUME_GAME).addEventListener(
        'click',
        LETETRIS._menuResumeGameElementSelected);
    document.getElementById(LETETRIS._MENU_HIGH_SCORES).addEventListener(
        'click',
        LETETRIS._menuHighScoresElementSelected);
}

LETETRIS._deactivateMenuScreen = function() {
    document.getElementById(LETETRIS._MENU).style.display = 'none';
    document.getElementById(LETETRIS._MENU_NEW_GAME).removeEventListener(
        'click',
        LETETRIS._menuNewGameElementSelected);
    document.getElementById(LETETRIS._MENU_HIGH_SCORES).removeEventListener(
        'click',
        LETETRIS._menuHighScoresElementSelected);
}

LETETRIS._menuNewGameElementSelected = function() {
    LETETRIS._deactivateMenuScreen();
    LETETRIS._activateGameScreenForNewGame();
}

LETETRIS._menuResumeGameElementSelected = function() {
    LETETRIS._deactivateMenuScreen();
    LETETRIS._activateGameScreenForExistingGame();
}

LETETRIS._menuHighScoresElementSelected = function() {
    LETETRIS._deactivateMenuScreen();
    LETETRIS._activateHighScoreScreen();
}

/* HIGH SCORE SCREEN */

LETETRIS._activateHighScoreScreen = function() {
    document.getElementById(LETETRIS._HIGH_SCORES).style.display = 'inline-block';
    document.getElementById(LETETRIS._HIGH_SCORES_MENU).addEventListener(
        'click',
        LETETRIS._highScoresMenuElementSelected);
}

LETETRIS._deactivateHighScoreScreen = function() {
    document.getElementById(LETETRIS._HIGH_SCORES).style.display = 'none';
    document.getElementById(LETETRIS._HIGH_SCORES_MENU).removeEventListener(
        'click',
        LETETRIS._highScoresMenuElementSelected);
}

LETETRIS._highScoresMenuElementSelected = function() {
    LETETRIS._deactivateHighScoreScreen();
    LETETRIS._activateMenuScreen();
}

/* GAME SCREEN */

LETETRIS._activateGameScreenForNewGame = function() {
    var canvas = document.getElementById("game");
    canvas.style.display = 'inline';
    LETETRIS._initGame(canvas);
}

LETETRIS._activateGameScreenForResumedGame = function() {
    var canvas = document.getElementById(LETETRIS._GAME);
    LETETRIS._stepGame(canvas);
}

LETETRIS._deactivateGameScreen = function() {
    document.getElementById(LETETRIS._GAME).style.display = 'none';
}

LETETRIS._gamePaused = function() {
    LETETRIS._deactivateGameScreen();
    LETETRIS._activateMenuScreen(false);
}

/* GAME */

LETETRIS._initGame = function(canvas) {

    /* model */

    var grid = [];
    for (var row = 0; row < 20; row++) {
        grid[row] = [];
        for (var col = 0; col < 10; col++) {
            grid[row][col] = null;
        }
    }

    /* view */

    var context = canvas.getContext("2d");
    context.fillStyle = '#FF1493';
    context.lineWidth = 1;
    context.fillRect(0, 0, 20, 20);

    /* controller */

    LETETRIS._keysDown = {};

    addEventListener("keydown", function (e) {
	LETETRIS._keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
	delete LETETRIS._keysDown[e.keyCode];
    }, false);

    /* run game */

    LETETRIS._stepGame();
}

LETETRIS._stepGame = function(canvas) {
    if (LETETRIS._keysDown[27]) {
        LETETRIS._gamePaused();
        return;
    }

    requestAnimationFrame(LETETRIS._stepGame);
}
