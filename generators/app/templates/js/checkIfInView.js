const $ = require('jquery-slim');

const throttle = require('./throttle.js');
const requestAnimFrame = require('./requestAnimFrame.js');

module.exports = function( body, elts ){

    if( !elts.length ) return;

    let elt, eltHeight, eltTop, eltBottom;
    let windowHeight, windowScroll, windowBottom;
    const launchGapIn = 100, launchGapOut = 250;

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

    const scrollHandler = throttle(function(){
        requestAnimFrame( checkIfEltInView );
    }, 40);


    setEltData();
    

    $(document).on('scroll', scrollHandler);
    $(window).on('resize', scrollHandler);
}
