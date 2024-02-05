export const hasStorage = (key) => {
    return localStorage.getItem(key) !== null;
}

export const storage = (key, val) => {
    if (typeof val !== 'undefined') {
        return localStorage.setItem(key, JSON.stringify(val));
    } else {
        let data = localStorage.getItem(key);

        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        return data;
    }
}