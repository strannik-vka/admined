import { getDataValue } from "./GetDataValue";

export const template = (str, data) => {
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