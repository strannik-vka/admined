import React from "react";

class Input extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : '',
            isChange: false
        }
    }

    onInput = (event) => {
        this.setState({
            value: event.target.value,
            isChange: true
        }, () => {
            if (this.props.onInput) {
                this.props.onInput(event);
            }
        });
    }

    isErrors() {
        if (typeof this.props.errors === 'object' && this.props.errors != null) {
            return Object.keys(this.props.errors).length;
        }

        return false;
    }

    getValue() {
        let result = this.state.value;

        if (this.state.isChange == false) {
            if (this.props.type == 'datetime') {
                result = dateFormat(this.state.value, this.props.format);
            }
        }

        return result;
    }

    getPreview() {
        if (this.state.value) {
            if (this.props.type == 'video') {
                let src = this.state.value;

                if (src.indexOf('iframe') == -1) {
                    if (src.indexOf('youtu') > -1) {
                        let match = src.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
                        if ((match && match[7].length == 11)) {
                            src = 'https://www.youtube.com/embed/' + match[7];
                        }
                    } else if (src.indexOf('ok.ru') > -1 && src.indexOf('video/') > -1) {
                        let srcArr = src.split('video/');
                        src = 'https://ok.ru/videoembed/' + srcArr[1];
                    } else if (src.indexOf('vimeo.com') > -1 && src.indexOf('player') == -1) {
                        let srcArr = src.split('vimeo.com/');
                        src = 'https://player.vimeo.com/video/' + srcArr[1];
                    } else {
                        src = null;
                    }

                    if (src) {
                        return <div className="videoPreview">
                            <iframe height="300" src={src} frameBorder="0"></iframe>
                        </div>
                    }
                } else {
                    return <div className="videoPreview" dangerouslySetInnerHTML={{ __html: src }}></div>;
                }
            }
        }
    }

    render() {
        let value = this.getValue();

        return <>
            {this.getPreview()}
            <input
                name={this.props.name}
                type="text"
                className={this.isErrors() ? 'form-control is-invalid' : 'form-control'}
                onInput={this.onInput}
                value={value}
            />
            {
                this.props.max
                    ? <div className="textCount">{textCount(this.state.value)}/{this.props.max}</div>
                    : ''
            }
            {
                this.isErrors()
                    ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                    : ''
            }
        </>
    }

}

export default Input;