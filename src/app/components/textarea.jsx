import React from "react";
import InvalidText from "../forms/InvalidText";
import { TextCount } from "../../shared/lib/TextCount";

class Textarea extends React.Component {

    constructor(props) {
        super(props);

        var value = this.props.value ? this.props.value : '';

        this.state = {
            value: value
        }
    }

    autoHeight(elem) {
        if (elem) {
            if (elem.parentNode) {
                elem.parentNode.style.minHeight = elem.style.height;
            }

            elem.style.height = "inherit";
            elem.style.height = (Math.max(elem.scrollHeight, 100) + 5) + 'px';
            elem.style.overflow = "hidden";
        }
    }

    onKeyPress = (e) => {
        this.autoHeight(e.target);
    }

    componentDidMount() {
        setTimeout(() => {
            this.autoHeight(document.querySelector('form [name="' + this.props.name + '"]'));
        }, 100);
    }

    onInput = (event) => {
        this.setState({
            value: event.target.value
        });

        if (typeof this.props.onInput === 'function') {
            this.props.onInput(event);
        }
    }

    render() {
        return <>
            <textarea
                name={this.props.name}
                className={'form-control' + (this.props.errors ? ' is-invalid' : '')}
                onKeyDown={this.onKeyPress}
                onKeyUp={this.onKeyPress}
                onInput={this.onInput}
                value={this.state.value}
                maxLength={this.props.max}
            ></textarea>
            {
                this.props.max
                    ? <div className="textCount">{TextCount(this.state.value)}/{this.props.max}</div>
                    : ''
            }
            <InvalidText errors={this.props.errors} />
        </>;
    }

}

export default Textarea;