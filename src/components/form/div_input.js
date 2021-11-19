import isObject from "isobject";
import React from "react";

class DivInput extends React.Component {

    constructor(props) {
        super(props);

        this.onInputTimer = false;

        this.isOnInput = typeof this.props.onInput === 'function';
    }

    onInput = (e) => {
        var text = e.target.innerHTML,
            cursorPosition = getCursorPosition(e.target);

        if (text == '<div><br></div>' || text == '<br>' || text == '<br><br>') {
            e.target.innerHTML = '';
        }

        if (this.isOnInput) {
            if (this.onInputTimer) {
                clearTimeout(this.onInputTimer);
            }

            this.onInputTimer = setTimeout(() => {
                this.props.onInput(e.target.innerText, () => {
                    setCursorPosition(e.target, cursorPosition);
                });
            }, 1000);
        }
    }

    onPaste(e, type) {
        e.preventDefault();

        if (this.props.readonly) {
            return false;
        }

        var text = e.clipboardData.getData('text/plain');

        if (type == 'string') {
            text = text.replace(new RegExp("\\r?\\n", "g"), " ");
        }

        window.document.execCommand('insertText', false, text);
    }

    onCut(e) {
        if (this.props.readonly) {
            e.preventDefault();
            return false;
        }
    }

    onKeyPress(e, type) {
        if (this.props.readonly) {
            e.preventDefault();
            return false;
        }

        if (type == 'string') {
            if (e.key == 'Enter' || (e.shiftKey && e.key == 'Enter')) {
                e.preventDefault();
            }
        }
    }

    getValue() {
        var value = this.props.value;

        if (isObject(this.props.with) && typeof this.props.text_key !== 'undefined') {
            value = typeof this.props.with[this.props.text_key] !== 'undefined'
                ? this.props.with[this.props.text_key]
                : '';
        }

        return value;
    }

    className() {
        var result = 'form-control';

        if (this.props.center === true) {
            result += ' text-center';
        }

        if (this.props.readonly) {
            result += ' readonly';
        }

        if (isObject(this.props.onClick) || (typeof this.props.href !== 'undefined' && this.props.href)) {
            result += ' pointer';
        }

        return result;
    }

    onClick() {
        var isHref = (typeof this.props.href !== 'undefined' && this.props.href);

        if (isHref) {
            window.open(
                template(this.props.href, this.props.item),
                (typeof this.props.target !== 'undefined' && this.props.target ? this.props.target : '')
            );
        }
    }

    render() {
        const type = this.props.type ? this.props.type : 'string';

        return (
            <div
                name={this.props.name}
                placeholder={this.props.placeholder}
                contentEditable={true}
                suppressContentEditableWarning={true}
                type={type}
                className={this.className()}
                onPaste={(e) => this.onPaste(e, type)}
                onInput={this.onInput}
                onKeyPress={(e) => this.onKeyPress(e, type)}
                onCut={(e) => this.onCut(e)}
                onClick={() => this.onClick()}
            >
                {this.getValue()}
            </div>
        );
    }

}

export default DivInput;