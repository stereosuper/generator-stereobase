import 'intersection-observer';

const io = function() {

    this.resized = true;

    this.init = () => {
        const objectsToIO = [].slice.call(document.querySelectorAll('[data-io]'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio > 0.15) {
                    this[`${entry.target.dataset.io}In`](entry.target);
                    if (entry.target.hasAttribute('data-io-single')) observer.unobserve(entry.target);
                } else if (entry.intersectionRatio < 0.15) {
                    this[`${entry.target.dataset.io}Out`](entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '-100px 0px',
        });

        objectsToIO.forEach((obj) => {
            if (!obj.hasAttribute('data-io-observed')) {
                observer.observe(obj);
                obj.setAttribute('data-io-observed', '');
            }
        });
    };
};

export default new io();
