import React from "react";

class Input extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : ''
        }
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
                <input
                    name={this.props.name}
                    type="text"
                    className={this.props.errors ? 'form-control is-invalid' : 'form-control'}
                    onInput={this.onInput}
                    value={this.props.type == 'datetime' ? dateFormat(this.state.value) : this.state.value}
                />
                {
                    this.props.errors
                        ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                        : ''
                }
            </>
        );
    }

}

export default Input;