export const getDataValue = function (str, data) {
    if (typeof data[str] !== 'undefined') {
        return data[str];
    }

    if (typeof data[str + '[]'] !== 'undefined') {
        return data[str + '[]'];
    }

    let parts = [];

    if (str.indexOf('.') > -1) {
        parts = str.split('.');
    } else if (str.indexOf('[') > -1) {
        parts = str.split('[');

        parts = parts.map(item => {
            return item.replace(']', '');
        });
    } else {
        parts.push(str);
    }

    if (parts.length) {
        for (let i = 0; i < parts.length; i++) {
            data = data[parts[i]];

            if (!data) {
                break;
            }
        }

        return data === undefined ? null : data;
    }

    return null;
}