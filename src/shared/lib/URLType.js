export const isAudio = (url) => {
    if (url) {
        var ext = url.split('.'),
            ext = ext[ext.length - 1],
            ext = ext.toLowerCase(),
            ext = ext.split('?'),
            ext = ext[0],
            images = ['mp3', 'wav', 'ogg', 'wma', 'aac', 'flac'];

        return images.indexOf(ext) > -1;
    }

    return false;
}

export const isImage = (url) => {
    if (url) {
        var ext = url.split('.'),
            ext = ext[ext.length - 1],
            ext = ext.toLowerCase(),
            ext = ext.split('?'),
            ext = ext[0],
            images = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

        return images.indexOf(ext) > -1;
    }

    return false;
}