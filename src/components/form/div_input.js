import React from "react";

class DivInput extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeTimer = false;

        this.isOnChange = typeof this.props.onChange === 'function';
    }

    onInput = (e) => {
        var text = e.target.innerHTML,
            cursorPosition = getCursorPosition(e.target);

        if (text == '<div><br></div>' || text == '<br>' || text == '<br><br>') {
            e.target.innerHTML = '';
        }

        if (this.isOnChange) {
            if (this.onChangeTimer) {
                clearTimeout(this.onChangeTimer);
            }

            this.onChangeTimer = setTimeout(() => {
                this.props.onChange(e.target.innerText, () => {
                    setCursorPosition(e.target, cursorPosition);
                });
            }, 1000);
        }
    }

    onPaste(e, type) {
        e.preventDefault();

        var text = e.clipboardData.getData('text/plain');

        if (type == 'string') {
            text = text.replace(new RegExp("\\r?\\n", "g"), " ");
        }

        window.document.execCommand('insertText', false, text);
    }

    onKeyPress(e, type) {
        if (type == 'string') {
            if (e.key == 'Enter' || e.shiftKey) {
                e.preventDefault();
            }
        }
    }

    render() {
        const type = this.props.type ? this.props.type : 'string';

        return (
            <div
                name={this.props.name}
                placeholder={this.props.placeholder}
                contentEditable={!this.props.readonly}
                suppressContentEditableWarning={true}
                type={type}
                className={this.props.center === true ? 'form-control text-center' : 'form-control'}
                onPaste={(e) => this.onPaste(e, type)}
                onInput={this.onInput}
                onKeyPress={(e) => this.onKeyPress(e, type)}
            >
                {this.props.value ? this.props.value : ''}
            </div>
        );
    }

}

export default DivInput;