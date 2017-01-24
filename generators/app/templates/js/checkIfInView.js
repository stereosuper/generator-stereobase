var $ = require('jquery-slim');

var throttle = require('./throttle.js');
window.requestAnimFrame = require('./requestAnimFrame.js');

module.exports = function(body, elts){
    var elt, eltContent, eltHeight, eltTop, eltBottom;
    var windowHeight, windowScroll, windowBottom;
    var launchGapIn = 100, launchGapOut = 250;

    function checkIfEltInView(){
        windowHeight = $(window).height();
        windowScroll = $(window).scrollTop();
        windowBottom = windowScroll + windowHeight;

        elts.each(function(){
            elt = $(this);
            eltTop = elt.data('top');
            eltBottom = elt.data('bottom');
            if(eltBottom - launchGapOut >= windowScroll && eltTop + launchGapIn <= windowBottom){
                elt.removeClass('above-view under-view').addClass('in-view');
            }else if(eltBottom - launchGapOut < windowScroll){
                elt.addClass('above-view').removeClass('under-view in-view');
            }else{
                elt.removeClass('above-view in-view').addClass('under-view');
            }
        });
    }

    function setEltData(){
        elts.each(function(){
            elt = $(this);
            eltHeight = elt.outerHeight();
            eltTop = elt.offset().top;
            eltBottom = eltTop + eltHeight;
            elt.data({'top': eltTop, 'bottom': eltBottom});
        });
    }

    setEltData();

    var scrollHandler = throttle(function(){
        requestAnimFrame(checkIfEltInView);
    }, 40);

    $(document).on('scroll', scrollHandler);
    $(window).on('resize', scrollHandler);
}
