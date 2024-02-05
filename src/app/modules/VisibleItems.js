export default ({ selector, attr }, callback) => {
    let items = document.querySelectorAll(selector),
        result = [];

    items.forEach(item => {
        const rect = item.getBoundingClientRect();

        if (rect.bottom > 0 && rect.bottom <= ((window.innerHeight + rect.height) || document.documentElement.clientHeight)) {
            if (attr) {
                let attrVal = item.getAttribute(attr);
                result.push(isNaN(attrVal) ? attrVal : parseFloat(attrVal));
            } else {
                result.push(item);
            }
        }
    });

    callback(result);
}