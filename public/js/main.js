/* NAMESPACE */

var LETETRIS = LETETRIS || {};

/* "MAIN" */

LETETRIS.run = function() {
    LETETRIS._activateMenuScreen();
}

/* MENU SCREEN */

LETETRIS._activateMenuScreen = function() {
    document.getElementById('menu').style.display = 'inline-block';
    document.getElementById('menu-high-scores').addEventListener(
        'click',
        LETETRIS._menuHighScoresElementSelected);
}

LETETRIS._deactivateMenuScreen = function() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('menu-high-scores').removeEventListener(
        'click',
        LETETRIS._menuHighScoresElementSelected);
}

LETETRIS._menuHighScoresElementSelected = function() {
    LETETRIS._deactivateMenuScreen();
    LETETRIS._activateHighScoreScreen();
}

/* HIGH SCORE SCREEN */

LETETRIS._activateHighScoreScreen = function() {
    document.getElementById('high-scores').style.display = 'inline-block';
    document.getElementById('high-scores-menu').addEventListener(
        'click',
        LETETRIS._highScoresMenuElementSelected);
}

LETETRIS._deactivateHighScoreScreen = function() {
    document.getElementById('high-scores').style.display = 'none';
    document.getElementById('high-scores-menu').removeEventListener(
        'click',
        LETETRIS._highScoresMenuElementSelected);
}

LETETRIS._highScoresMenuElementSelected = function() {
    LETETRIS._deactivateHighScoreScreen();
    LETETRIS._activateMenuScreen();
}

/* GAME SCREEN */
