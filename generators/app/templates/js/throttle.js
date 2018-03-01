module.exports = function( callback, delay ){

    let last, timer;

    
    return function(){
        const context = this, now = +new Date(), args = arguments;


        function reset(){
            last = now;
            callback.apply( context, args );
        }

        
        if( last && now < last + delay ){
            // le délai n'est pas écoulé on reset le timer
            clearTimeout( timer );

            timer = setTimeout(reset, delay);
        }else{
            reset();
        }
    };
    
}
