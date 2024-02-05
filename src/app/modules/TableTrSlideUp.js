const addStyles = (duration) => {
    let stylesElem = document.querySelector('#tableTrSlideUpStyles');

    if (!stylesElem) {
        let styles = document.createElement('style');

        styles.id = 'tableTrSlideUpStyles';

        styles.innerHTML = `
            .tableTrSlideUpTd {
                transition: `+ duration + `s linear;
                border-top: 0!important;
                border-bottom: 0!important;
                padding-top: 0!important;
                padding-bottom: 0!important;
            }

            .tableTrSlideUpWrap {
                transition: `+ duration + `s linear;
                overflow: hidden;
                max-height: 0!important;
                border-top: 0!important;
                border-bottom: 0!important;
                padding-top: 0!important;
                padding-bottom: 0!important;
            }
        `;

        document.head.appendChild(styles);
    }
}

const addWraps = (trElem) => {
    let tdElems = trElem.querySelectorAll('td');

    tdElems.forEach(tdElem => {
        tdElem.innerHTML = '<div style="max-height:31px">' + tdElem.innerHTML + '</div>';
    });
}

const startAnimate = (trElem, callback) => {
    let tdElems = trElem.querySelectorAll('td');

    setTimeout(() => {
        tdElems.forEach(tdElem => {
            tdElem.className += ' tableTrSlideUpTd';
            tdElem.querySelector('div').className += ' tableTrSlideUpWrap';
        });

        if (callback) {
            callback();
        }
    }, 100);
}

const removeWraps = (trElem) => {
    let tableTrSlideUpTdElems = trElem.querySelectorAll('.tableTrSlideUpTd');

    tableTrSlideUpTdElems.forEach(tableTrSlideUpTdElem => {
        tableTrSlideUpTdElem.style.display = 'none';
        tableTrSlideUpTdElem.className = tableTrSlideUpTdElem.className.replace(/ tableTrSlideUpTd/g, '');

        let wrapElem = tableTrSlideUpTdElem.querySelector('.tableTrSlideUpWrap');

        tableTrSlideUpTdElem.innerHTML = wrapElem.innerHTML;
    });
}

const endAnimate = (duration, callback) => {
    setTimeout(() => {
        if (callback) {
            callback();
        }
    }, (duration * 1000) + 100);
}

export default (trElem, duration, callback) => {
    if (trElem) {
        if (typeof duration === 'function') {
            callback = duration;
            duration = 0.8;
        }

        duration = duration ? duration : 0.8;

        addStyles(duration);

        addWraps(trElem);

        startAnimate(trElem, () => {
            endAnimate(duration, () => {
                if (callback) {
                    callback();
                }

                removeWraps(trElem);
            });
        });
    } else {
        if (callback) {
            callback();
        }
    }
}