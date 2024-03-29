export const imageUrl = (url, thumb) => {
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