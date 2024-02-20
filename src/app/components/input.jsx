import React from "react";
import InvalidText from "../../shared/ui/form/InvalidText";
import { TextCount } from "../../shared/lib/TextCount";
import { dateFormat } from "../../shared/lib/DateFormat";

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
        let value = this.getValue(),
            type = this.props.type == 'hidden' ? 'hidden' : 'text';

        if (this.props.password) {
            type = 'password';
        } else if (this.props.email) {
            type = 'email';
        }

        return <>
            {this.getPreview()}
            <input
                name={this.props.name}
                type={type}
                className={this.isErrors() ? 'form-control is-invalid' : 'form-control'}
                onInput={this.onInput}
                value={value}
                required={this.props.required}
            />
            {
                this.props.max
                    ? <div className="textCount">{TextCount(this.state.value)}/{this.props.max}</div>
                    : ''
            }
            <InvalidText errors={this.props.errors} />
        </>
    }

}

export default Input;