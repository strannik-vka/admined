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

window.currentUrl = () => {
    var url = location.href.indexOf('url=') > -1 ? location.href : false;

    if (url) {
        url = url.split('url=');
        url = url[1];
    }

    return url;
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