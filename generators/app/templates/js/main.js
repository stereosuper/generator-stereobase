'use strict';

$(function(){

    var body = $('body');
    var windowWidth = $(window).width(), windowHeight = $(window).height();

    window.requestAnimFrame = require('./requestAnimFrame.js');



    // isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');


    $(window).on('resize', function(){

        windowWidth = $(window).width();
        windowHeight = $(window).height();

	}).on('load', function(){

	});


    $(document).on('scroll', function(){

    });

});
