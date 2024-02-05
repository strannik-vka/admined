export const TextCount = (elem) => {
    let value = typeof elem === 'string' ? elem : elem.value;

    if (value) {
        value = value.trim();
        value = value.replace(/\n/g, '\n\r');
    }

    return value.length;
}