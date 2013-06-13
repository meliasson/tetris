var UTIL = {};

UTIL.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

UTIL.Action = {
    DOWN: '',
    DROP: '',
    LEFT: '',
    PAUSE: 27,
    RIGHT: '',
    ROTATE: ''
};
