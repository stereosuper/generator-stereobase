'use strict';

var $ = require('./libs/jquery/dist/jquery.slim.min.js');

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var throttle = require('./throttle.js');

    var body = $('body');
    var windowWidth = $(window).outerWidth(), windowHeight = $(window).height();



    // isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');


    $(window).on('resize', throttle(function(){

        windowWidth = $(window).outerWidth();
        windowHeight = $(window).height();

    }, 60)).on('load', function(){

    });


    $(document).on('scroll', throttle(function(){

    }, 60));

});
