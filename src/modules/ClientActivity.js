/*  
    onStopScroll  - остановился скролл   /scroll
    onStop        - закрыли вкладку
    onPause       - пропала активность
    onPlay        - появилась активность /click/mousemove/keydown
    onActive      - проявил активность   /click/mousemove/keydown
    delayOnActive - задержка в мс для onActive (по умолчанию 1 сек)
    timeOnPause   - время в мс после чего пропадает активность (запуск onPause)
*/

let isPause = false,
    timer = false,
    scrollTimer = false,
    onActiveAllow = true;

export default (options) => {
    if (!options.timeOnPause) {
        options.timeOnPause = 120000; // 2 минут
    }

    if (!options.delayOnActive) {
        options.delayOnActive = 1000; // 1 сек
    }

    const onPause = () => {
        isPause = true;

        if (options.onPause) {
            options.onPause();
        }
    }

    const startTimeOnPause = () => {
        isPause = false;

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            onPause();
        }, options.timeOnPause);
    }

    const onActive = () => {
        if (isPause) {
            if (options.onPlay) {
                options.onPlay();
            }
        } else {
            if (onActiveAllow) {
                onActiveAllow = false;

                if (options.onActive) {
                    options.onActive();
                }

                setTimeout(() => {
                    onActiveAllow = true;
                }, options.delayOnActive);
            }
        }

        startTimeOnPause();
    }

    document.addEventListener('click', onActive);
    document.addEventListener('mousemove', onActive);
    document.addEventListener('keydown', onActive);
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }

        scrollTimer = setTimeout(() => {
            startTimeOnPause();

            if (options.onStopScroll) {
                options.onStopScroll();
            }
        }, 1000);
    });
    window.addEventListener('unload', () => {
        if (options.onStop) {
            options.onStop();
        }
    });
}