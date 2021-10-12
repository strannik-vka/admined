import React from "react";

class Textarea extends React.Component {

    constructor(props) {
        super(props);

        var value = this.props.value ? this.props.value : '';

        this.state = {
            value: value
        }
    }

    autoHeight(elem) {
        elem.parentNode.style.minHeight = elem.style.height;
        elem.style.height = "inherit";
        elem.style.height = (Math.max(elem.scrollHeight, 100) + 5) + 'px';
        elem.style.overflow = "hidden";
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

        this.props.errorHide(event);
    }

    render() {
        return (
            <>
                <textarea
                    name={this.props.name}
                    className={this.props.errors ? 'form-control is-invalid' : 'form-control'}
                    onKeyDown={this.onKeyPress}
                    onKeyUp={this.onKeyPress}
                    onInput={this.onInput}
                    value={this.state.value}
                ></textarea>
                {
                    this.props.errors
                        ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                        : ''
                }
            </>
        );
    }

}

export default Textarea;