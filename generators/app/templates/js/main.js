'use strict';

var $ = require('jquery-slim');
<% if (greensock) { %>
// require('gsap');
require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');
<% } %>

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var throttle = require('./throttle.js');

    var body = $('body');
    var windowWidth = $(window).outerWidth(), windowHeight = $(window).height();



    // isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    function resizeHandler(){
        windowWidth = $(window).outerWidth();
        windowHeight = $(window).height();
    }

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60)).on('load', function(){

    });


    $(document).on('scroll', throttle(function(){

    }, 60));

});
