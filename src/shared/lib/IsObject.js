export const isObject = function (val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}