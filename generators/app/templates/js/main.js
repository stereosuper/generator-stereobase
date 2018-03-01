'use strict';

const $ = require('jquery-slim');
<% if (greensock) { %>
// require('gsap');
require('gsap/CSSPlugin');
const TweenLite = require('gsap/TweenLite');
<% } %>

$(function(){

    require('./requestAnimFrame.js');
    const throttle = require('./throttle.js');
    const noTransition = require('./noTransition.js');

    const body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    let windowWidth = window.outerWidth, windowHeight = $(window).height();


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    function loadHandler(){

    }


    // isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    // Since script is loaded asynchronously, load event isn't always fired !!!
    document.readyState === 'complete' ? loadHandler() : $(window).on('load', loadHandler);

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){

    }, 60));

});
