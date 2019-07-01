export const forEach = (arr, callback) => {
    let i = 0;
    const { length } = arr;
    while (i < length) {
        callback(arr[i], i);
        i += 1;
    }
};

export const roundNumbers = (number, decimalNumber) => {
    const decimalsFactor = 10 ** decimalNumber;
    return Math.round(number * decimalsFactor) / decimalsFactor;
};

export const reverseString = str =>
    str
        .split('')
        .reverse()
        .join('');

let newEvent;
if ( typeof window.CustomEvent === "function" ){
    newEvent = eventName => {
        let e = new Event(eventName);
        if (typeof Event !== 'function') {
            e = document.createEvent('Event');
            e.initEvent(eventName, true, true);
        }
        return e;
    };
} else {
    // ie 11
    newEvent  = ( event, params ) => {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    };

    newEvent.prototype = window.Event.prototype;
    window.CustomEvent = newEvent;
}
export const createNewEvent = newEvent;

export const requestAnimFrame = cb => {
    const anim =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    return anim(cb);
};

export const throttle = (callback, delay) => {
    let last;
    let timer;

    return function throttleFunction(...args) {
        const now = +new Date();

        const reset = () => {
            last = now;
            callback.apply(this, args);
        };

        if (last && now < last + delay) {
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);

            timer = setTimeout(reset, delay);
        } else {
            reset();
        }
    };
};

export const query = (selector, context) => {
    context = context || document;
    // Redirect simple selectors to the more performant function
    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
        switch (selector.charAt(0)) {
            case '#':
                // Handle ID-based selectors
                return [context.getElementById(selector.substr(1))];
            case '.':
                // Handle class-based selectors
                // Query by multiple classes by converting the selector 
                // string into single spaced class names
                const classes = selector.substr(1).replace(/\./g, ' ');
                return [...context.getElementsByClassName(classes)];
            default:
                // Handle tag-based selectors
                return [...context.getElementsByTagName(selector)];
        }
    }
    // Default to `querySelectorAll`
    return [...context.querySelectorAll(selector)];
}

export default {
    roundNumbers,
    forEach,
    reverseString,
    createNewEvent,
    requestAnimFrame,
    throttle,
    query
};