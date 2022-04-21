import isObject from "isobject";
import React from "react";

class DivInput extends React.Component {

    constructor(props) {
        super(props);

        this.onInputTimer = false;

        this.isOnInput = typeof this.props.onInput === 'function';

        this.state = {
            focus: false,
            value: this.props.value
        }
    }

    onFocus = () => {
        var data = {
            focus: true
        };

        if (this.props.value != this.state.value) {
            data.value = this.props.value;
        }

        this.setState(data);
    }

    onBlur = () => {
        this.setState({
            focus: false
        });
    }

    onInput = (e) => {
        var text = e.target.innerHTML,
            cursorPosition = getCursorPosition(e.target);

        if (text == '<div><br></div>' || text == '<br>' || text == '<br><br>') {
            e.target.innerHTML = '';
        }

        text = e.target.innerText;

        this.setState({
            value: text
        }, () => {
            if (this.isOnInput) {
                setCursorPosition(e.target, cursorPosition);

                if (this.onInputTimer) {
                    clearTimeout(this.onInputTimer);
                }

                this.onInputTimer = setTimeout(() => {
                    this.props.onInput(text, () => {
                        this.onInputTimer = false;
                    });
                }, 1000);
            }
        });
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
        var value = this.state.focus || this.onInputTimer ? this.state.value : this.props.value;

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
            <>
                <div
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    type={type}
                    className={this.className()}
                    onPaste={(e) => this.onPaste(e, type)}
                    onInput={this.onInput}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyPress={(e) => this.onKeyPress(e, type)}
                    onCut={(e) => this.onCut(e)}
                    onClick={() => this.onClick()}
                    style={this.props.href ? { textDecoration: 'underline', cursor: 'pointer' } : {}}
                >
                    {this.getValue()}
                </div>
                {
                    this.props.href
                        ? <svg className="icon_href" width="16" viewBox="0 0 416 368" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M400 184L224 16V112C55.57 112 16 232.77 16 352C64.61 289.76 107.6 256 224 256V352L400 184Z" stroke="black" stroke-width="32" stroke-linejoin="round" />
                        </svg>
                        : ''
                }
            </>
        );
    }

}

export default DivInput;