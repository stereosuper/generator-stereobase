module.exports = function(callback, delay){
    var last, timer;
    return function (){
        var context = this, now = +new Date(), args = arguments;
        if(last && now < last + delay){
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);
            timer = setTimeout(function (){
                last = now;
                callback.apply(context, args);
            }, delay);
        }else{
            last = now;
            callback.apply(context, args);
        }
    };
}
