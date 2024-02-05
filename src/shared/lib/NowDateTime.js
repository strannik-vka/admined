export const nowDateTime = () => {
    var date = new Date(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        datetime = '';

    datetime += date.getFullYear() + '-';
    datetime += (month < 10 ? '0' + month : month) + '-';
    datetime += (day < 10 ? '0' + day : day) + ' ';
    datetime += date.toLocaleTimeString().slice(0, -3);

    return datetime;
}