const $ = require('jquery-slim');

const requestAnimFrame = require('./requestAnimFrame.js');
const throttle = require('./throttle.js');

module.exports = function( el ){

    if( !el.length ) return;


    let rtime, timeout = false;
    const delta = 200;


    function resizeend(){
        if( new Date() - rtime < delta ){
            setTimeout(resizeend, delta);
        }else{
            timeout = false;
            el.removeClass('no-transition');
        }
    }

    function resizeHandler(){
        el.addClass('no-transition');
        rtime = new Date();

        if( timeout ) return;

        timeout = true;
        setTimeout(resizeend, delta);
    }


    $(window).on('resize', throttle(function(){
        requestAnimFrame( resizeHandler );
    }, 60));

}
