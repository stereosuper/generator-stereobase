module.exports = function( name ){
    let params = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href),
        results = params == null ? null : params[1] || 0;
        
    return results;
}
