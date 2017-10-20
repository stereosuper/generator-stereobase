var $ = require('jquery');

window.requestAnimFrame = require('./requestAnimFrame.js');
var throttle = require('./throttle.js');

var rtime;
var timeout = false;
var delta = 200;

module.exports = function(el){

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            el.removeClass('no-transition');
        }
    }

    function resizeHandler() {
        el.addClass('no-transition');
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    }

    $(window).on('resize', throttle(function () {
        requestAnimFrame(resizeHandler);
    }, 60));

}
