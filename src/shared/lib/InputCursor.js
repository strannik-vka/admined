export const getCursorPosition = (parent) => {
    let selection = document.getSelection();
    let range = new Range;
    range.setStart(parent, 0);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    return range.toString().length;
}

export const setCursorPosition = (parent, position) => {
    let child = parent.firstChild;
    while (position > 0) {
        let length = child.textContent.length;
        if (position > length) {
            position -= length;
            child = child.nextSibling;
        } else {
            if (child.nodeType == 3) {
                return document.getSelection().collapse(child, position);
            }

            child = child.firstChild;
        }
    }
}