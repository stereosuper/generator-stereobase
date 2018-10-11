const $ = require('jquery-slim');
const snif = require('./Snif');

const init = function init(body, html) {
    if (snif.isIOS()) html.addClass('is-ios');

    if (snif.isSafari()) html.addClass('is-safari');

    if (snif.isFF()) html.addClass('is-ff');

    if (snif.isMS()) html.addClass('is-ms');

    if (snif.isIe11()) html.addClass('is-ie');
};

export default init;
