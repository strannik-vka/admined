export const dateFormat = (value, format) => {
    if (value) {
        if (format == 'H:i') {
            if (value.lastIndexOf(':') == 5) {
                value = value.substr(0, 5);
            }
        } else {
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
    }

    return value;
}