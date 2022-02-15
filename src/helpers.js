window.getCursorPosition = (parent) => {
    let selection = document.getSelection();
    let range = new Range;
    range.setStart(parent, 0);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    return range.toString().length;
}

window.setCursorPosition = (parent, position) => {
    let child = parent.firstChild;
    while (position > 0) {
        let length = child.textContent.length;
        if (position > length) {
            position -= length;
            child = child.nextSibling;
        } else {
            if (child.nodeType == 3) {
                return document.getSelection().collapse(child, position);
            }

            child = child.firstChild;
        }
    }
}

window.dateFormat = (value) => {
    if (value) {
        var date = new Date(value);

        if (date != 'Invalid Date') {
            var month = date.getMonth() + 1,
                day = date.getDate();

            value = '';
            value += date.getFullYear() + '-';
            value += (month < 10 ? '0' + month : month) + '-';
            value += (day < 10 ? '0' + day : day) + ' ';
            value += date.toLocaleTimeString().slice(0, -3);
        }
    }

    return value;
}

window.isImage = (url) => {
    if (url) {
        var ext = url.split('.'),
            ext = ext[ext.length - 1],
            ext = ext.toLowerCase(),
            ext = ext.split('?'),
            ext = ext[0],
            images = ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'];

        return images.indexOf(ext) > -1;
    }

    return false;
}

window.URLParam = (name) => {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (results == null) {
        return null;
    }

    return decodeURI(results[1]) || 0;
}

window.imageUrl = (url, thumb) => {
    if (thumb && url) {
        var name = url.split('/'),
            name = name[name.length - 1];
    }

    return url ? (
        thumb
            ? url.replace(name, thumb + '_' + name)
            : url
    ) : '';
}

window.isObject = function (val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

window.getDataValue = function (str, data) {
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

        return data ? data : null;
    }

    return null;
}

window.template = (str, data) => {
    var result = str;

    if (str) {
        var codes = str.match(/\{([^\}]*)\}/g);

        codes.forEach(element => {
            var key = element.replace('{', '').replace('}', ''),
                value = getDataValue(key, data);

            var regex = new RegExp(element, "g");
            result = result.replace(regex, value);
        });
    }

    return result;
}