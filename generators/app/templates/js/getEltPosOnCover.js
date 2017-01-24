var $ = require('jquery-slim');

module.exports = function(container, imgRatio, imgW, imgH, elt){
    containerH = container.outerHeight();
    containerW = container.width();
    containerRatio = containerH / containerW;

    posX = elt.data('x');
    posY = elt.data('y');

    if(containerRatio > imgRatio){
        // portrait
        finalH = containerH;
        finalW = imgW*finalH / imgH;
        newX = finalW*posX / imgW - (finalW - containerW)/2;
        newY = finalH*posY / imgH;
    }else{
        // paysage
        finalW = containerW;
        finalH = imgH*finalW / imgW;
        newX = finalW*posX / imgW;
        newY = finalH*posY / imgH - (finalH - containerH)/2;
    }

    ratioScale = (finalH / imgH).toFixed(3);

    return [newX, newY, ratioScale];
}
