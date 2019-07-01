import 'intersection-observer';
import { forEach, createNewEvent } from '.';

function Io() {
    this.resized = true;
    const minThreshold = 0.15;
    let indexThreshold = 0;
    const thresholdsNumber = 10;
    const thresholdSamples = [];

    for (
        indexThreshold;
        indexThreshold <= thresholdsNumber;
        indexThreshold += 1
    ) {
        thresholdSamples[indexThreshold] = indexThreshold / thresholdsNumber;
    }
    this.init = () => {
        const objectsToIO = [].slice.call(
            document.querySelectorAll('[data-io]')
        );

        const observer = new IntersectionObserver(
            entries => {
                forEach(entries, entry => {
                    if (entry.intersectionRatio > minThreshold) {
                        this[`${entry.target.dataset.io}In`](entry);
                        if (entry.target.hasAttribute('data-io-single'))
                            observer.unobserve(entry.target);
                    }
                    // else if (entry.intersectionRatio < threshold) {
                    //     this[`${entry.target.dataset.io}Out`](entry.target);
                    // }
                });
            },
            {
                threshold: thresholdSamples,
                rootMargin: '-100px 0px',
            }
        );

        forEach(objectsToIO, obj => {
            if (obj.hasAttribute('data-io-observed')) return;

            observer.observe(obj);
            obj.setAttribute('data-io-observed', '');
        });
    };

    // Reveal minions
}

export default new Io();