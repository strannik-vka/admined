export default ({ value, max, show, onChange }) => {
    if (typeof show === 'undefined') {
        show = typeof max !== 'undefined';
    }

    if (show) {
        let size = 0, isString = typeof value === 'string';

        if (value) {
            if (isString) {
                value = value.replace(/\r(?!\n)|\n(?!\r)/g, " ");
                value = value.trim();
                size = value.length;
            } else {
                for (let i = 0; i < value.length; i++) {
                    size += value[i].size;
                }

                size = Math.round(size / 1024);
            }
        }

        if (typeof onChange === 'function') {
            onChange(size);
        }

        let className = '', text;

        if (value) {
            if (max) {
                if (size > max) {
                    className = ' value-size-error';
                }

                if (isString == false) {
                    text = <span className="value-size-text"> кб</span>
                }
            } else {
                if (isString == false) {
                    text = <span className="value-size-text"> кб</span>
                }
            }
        }

        return <div className={'value-size' + (className)}>{size.toLocaleString()}{!max && text}{max && '/' + max.toLocaleString()}{max && text}</div>
    }
}