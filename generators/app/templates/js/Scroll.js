const $ = require('jquery-slim');

const win = require('./Window');
const requestAnimFrame = require('./requestAnimFrame.js');
const throttle = require('./throttle.js');

const Scroll = function ScrollClass() {
    this.scrollTop = $(window).scrollTop() || window.scrollY;
    this.event = null;
    this.scrollFunctions = [];
    this.endFunctions = [];
    this.timeout = null;

    this.scrollHandler = () => {
        this.scrollTop = $(window).scrollTop() || window.scrollY;
        clearTimeout( this.timeout );

        this.timeout = setTimeout(() => {
            this.onScrollEnd();
        }, 66);

        this.scrollFunctions.forEach((f) => {
            f();
        });
    };

    this.addScrollFunction = (f, onEnd = false) => {
        this.scrollFunctions.push(f);
        if(onEnd) this.endFunctions.push(f);
    };

    this.addEndFunction = (f) => {
        this.endFunctions.push(f);
    };


    this.init = () => {
        this.scrollHandler();
        $(window).on(
            'scroll',
            throttle((e) => {
                this.event = e;
                requestAnimFrame(this.scrollHandler);
            })
        );
    };

    this.onScrollEnd = () => {
        this.endFunctions.forEach((f) => {
            f();
        });
    }
};

module.exports = new Scroll();
