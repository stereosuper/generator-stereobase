const $ = require('jquery-slim');

const requestAnimFrame = require('./requestAnimFrame.js');
const throttle = require('./throttle.js');
const io = require('./io.js');

const app = function Window() {
    this.w = window.innerWidth;
    this.h = $(window).height();
    this.noTransitionElts = null;
    this.resizeFunctions = [];

    let rtime;
    let timeout = false;
    const delta = 200;

    this.resizeend = () => {
        if (new Date() - rtime < delta) {
            setTimeout(this.resizeend, delta);
        } else {
            timeout = false;
            this.noTransitionElts.removeClass('no-transition');
        }
    };

    this.noTransition = () => {
        this.noTransitionElts.addClass('no-transition');
        rtime = new Date();

        if (timeout === false) {
            timeout = true;
            setTimeout(this.resizeend, delta);
        }
    };

    this.ioResize = () => {
        if (!io.resized) io.resized = true;
    };

    this.resizeHandler = () => {
        this.w = window.innerWidth;
        this.h = $(window).height();
        this.resizeFunctions.forEach(f => {
            f();
        });
    };

    this.addResizeFunction = f => {
        this.resizeFunctions.push(f);
    };

    this.init = () => {
        this.resizeFunctions = [this.noTransition, this.ioResize];
        $(window).on(
            'resize',
            throttle(() => {
                requestAnimFrame(this.resizeHandler);
            }, 60)
        );
    };
};

module.exports = new app();
