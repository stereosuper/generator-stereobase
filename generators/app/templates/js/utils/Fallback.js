import snif from './Snif';

function Fallback() {
    this.html = document.documentElement;
}

Fallback.prototype.init = function init() {
    if (snif.isIOS()) this.html.classList.add('is-ios');

    if (snif.isSafari()) this.html.classList.add('is-safari');

    if (snif.isFF()) this.html.classList.add('is-ff');

    if (snif.isChromeAndroid()) this.html.classList.add('is-ca');

    if (snif.isMS()) this.html.classList.add('is-ms');

    if (snif.isIe11()) this.html.classList.add('is-ie');
};

export default new Fallback();