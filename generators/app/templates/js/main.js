import '../scss/main.scss';

import win from './Window.js';
import io from './Io.js';
import scroll from './Scroll.js';
import fallback from './Fallback.js';

const loadHandler = () => {
    if (document.readyState !== 'complete') return;
    scroll.init();
    win.setNoTransitionElts([...document.getElementsByClassName('element-without-transition-on-resize')]);
    win.init();
    io.init();
    fallback.init();
}

if (document.readyState === 'complete') {
   loadHandler();
} else {
   $(window).on('load', loadHandler);
}
