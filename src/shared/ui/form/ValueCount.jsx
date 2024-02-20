export default ({ value, max, splitter, show, onChange }) => {
    if (typeof show === 'undefined') {
        show = typeof max !== 'undefined';
    }

    if (show) {
        let count = 0, isString = typeof value === 'string';

        if (value) {
            if (isString) {
                value = value.replace(/\r(?!\n)|\n(?!\r)/g, " ");
                value = value.trim();
                value = value.split(splitter);
                value = value.filter(item => item.trim() != '')
                count = value.length;
            } else {
                count = value.length;
            }
        }

        if (typeof onChange === 'function') {
            onChange(count);
        }

        let className = '', text;

        if (value) {
            if (max) {
                if (count > max) {
                    className = ' value-count-error';
                }

                if (isString == false) {
                    text = <span className="value-count-text"> шт</span>
                }
            } else {
                if (isString == false) {
                    text = <span className="value-count-text"> шт</span>
                }
            }
        }

        return <div className={'value-count' + (className)}>{count.toLocaleString()}{!max && text}{max && '/' + max.toLocaleString()}{max && text}</div>
    }
}