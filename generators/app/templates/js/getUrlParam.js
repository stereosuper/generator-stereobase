module.exports = function(name){
    var params = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href),
        results = params == null ? null : params[1] || 0;
    return results;
}
