var letetris = letetris || {};

/* ROOT */

letetris.screenManager = {};

letetris.screenManager.run = function() {
    this.menuScreen.init();
    this.gamePausedScreen.init();
    this.gameOverScreen.init();
    this.highScoresScreen.init();
    this.menuScreen.activate();
};

/* MENU SCREEN */

letetris.screenManager.menuScreen = {};

letetris.screenManager.menuScreen.init = function() {
    document.getElementById('menu-new-game').addEventListener(
        'click',
        this.startGame);
    document.getElementById('menu-high-scores').addEventListener(
        'click',
        this.toHighScores);
};

letetris.screenManager.menuScreen.activate = function() {
    document.getElementById('menu').style.display = 'inline-block';
};

letetris.screenManager.menuScreen.deactivate = function() {
    document.getElementById('menu').style.display = 'none';
};

letetris.screenManager.menuScreen.startGame = function() {
    letetris.screenManager.menuScreen.deactivate();
    letetris.screenManager.gameScreen.activate();
};

letetris.screenManager.menuScreen.toHighScores = function() {
    letetris.screenManager.menuScreen.deactivate();
    letetris.screenManager.highScoresScreen.activate();
};

/* GAME PAUSED SCREEN */

letetris.screenManager.gamePausedScreen = {};

letetris.screenManager.gamePausedScreen.init = function() {
    document.getElementById('game-paused-resume-game').addEventListener(
        'click',
        this.resumeGame);
    document.getElementById('game-paused-quit-game').addEventListener(
        'click',
         this.quitGame);
};

letetris.screenManager.gamePausedScreen.activate = function() {
    document.getElementById('game-paused').style.display = 'inline-block';
};

letetris.screenManager.gamePausedScreen.deactivate = function() {
    document.getElementById('game-paused').style.display = 'none';
};

letetris.screenManager.gamePausedScreen.resumeGame = function() {
    letetris.screenManager.gamePausedScreen.deactivate();
    letetris.screenManager.gameScreen.reactivate();
};

letetris.screenManager.gamePausedScreen.quitGame = function() {
    letetris.screenManager.gamePausedScreen.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* GAME OVER SCREEN */

letetris.screenManager.gameOverScreen = {};

letetris.screenManager.gameOverScreen.init = function() {
    document.getElementById('game-over-menu').addEventListener(
        'click',
        letetris.screenManager.gameOverScreen.toMenu);
};

letetris.screenManager.gameOverScreen.activate = function() {
    document.getElementById('game-over').style.display = 'inline-block';
};

letetris.screenManager.gameOverScreen.deactivate = function() {
    document.getElementById('game-over').style.display = 'none';
};

letetris.screenManager.gameOverScreen.toMenu = function() {
    letetris.screenManager.gameOverScreen.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* HIGH SCORES SCREEN */

letetris.screenManager.highScoresScreen = {};

letetris.screenManager.highScoresScreen.init = function() {
    document.getElementById('high-scores-menu').addEventListener(
        'click',
        letetris.screenManager.highScoresScreen.toMenu);
};

letetris.screenManager.highScoresScreen.activate = function() {
    document.getElementById('high-scores').style.display = 'inline-block';
};

letetris.screenManager.highScoresScreen.deactivate = function() {
    document.getElementById('high-scores').style.display = 'none';
};

letetris.screenManager.highScoresScreen.toMenu = function() {
    letetris.screenManager.highScoresScreen.deactivate();
    letetris.screenManager.menuScreen.activate();
};

/* GAME SCREEN */

letetris.screenManager.gameScreen = {};

letetris.screenManager.gameScreen.activate = function() {
    var canvas = document.getElementById('game');
    canvas.style.display = 'inline';
    letetris.game.run(canvas);
};

letetris.screenManager.gameScreen.deactivate = function() {
    document.getElementById('game').style.display = 'none';
};

letetris.screenManager.gameScreen.reactivate = function() {
    var canvas = document.getElementById('game');
    canvas.style.display = 'inline';
    letetris.game.resume();
};

letetris.screenManager.gameScreen.gamePaused = function() {
    this.deactivate();
    letetris.screenManager.gamePausedScreen.activate();
};

letetris.screenManager.gameScreen.gameOver = function() {
    this.deactivate();
    letetris.screenManager.gameOverScreen.activate();
};
