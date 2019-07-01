import { requestAnimFrame } from '.';

function Scroll() {
    this.scrollTop = null;
    this.event = null;
    this.timeoutScroll = null;
    this.scrollEnd = true;
    this.scrollFunctions = [];
    this.endFunctions = [];
}

Scroll.prototype.scrollHandler = function scrollHandler() {
    this.scrollTop = window.pageYOffset || window.scrollY;

    if (this.scrollEnd) {
        this.scrollEnd = false;
    }

    clearTimeout(this.timeoutScroll);

    this.timeoutScroll = setTimeout(() => {
        this.onScrollEnd();
    }, 66);

    this.scrollFunctions.forEach(f => {
        f();
    });
};

Scroll.prototype.launchScroll = function launchScroll(e) {
    this.event = e;

    requestAnimFrame(() => {
        this.scrollHandler();
    });
};

Scroll.prototype.init = function initScroll() {
    this.scrollHandler();
    window.addEventListener(
        'scroll',
        () => {
            this.launchScroll();
        },
        false
    );
};

Scroll.prototype.destroyScroll = function destroyScroll() {
    window.removeEventListener(
        'scroll',
        () => {
            this.launchScroll();
        },
        false
    );
};

Scroll.prototype.onScrollEnd = function onScrollEnd() {
    this.scrollEnd = true;
    this.endFunctions.forEach(f => {
        f();
    });
};

Scroll.prototype.addScrollFunction = function addScrollFunction(
    f,
    onEnd = false
) {
    this.scrollFunctions.push(f);
    if (onEnd) this.endFunctions.push(f);
};

Scroll.prototype.addEndFunction = function addEndFunction(f) {
    this.endFunctions.push(f);
};

export default new Scroll();