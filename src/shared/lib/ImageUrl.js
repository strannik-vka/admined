export const imageUrl = (url, thumb) => {
    if (url) {
        if (url.indexOf('.svg') > -1) {
            return url;
        }

        if (thumb) {
            var name = url.split('/'),
                name = name[name.length - 1];
        }
    }

    return url ? (
        thumb
            ? url.replace(name, thumb + '_' + name)
            : url
    ) : '';
}