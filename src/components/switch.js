import React from "react";

class Switch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.checked
        }

        this.isOnChange = typeof this.props.onChange === 'function';
    }

    onChange = (event) => {
        if (this.isOnChange) {
            this.props.onChange(event.target.checked ? 1 : 0);
        } else {
            this.setState({
                checked: event.target.checked
            });
        }
    }

    getDisabledElement = () => {
        if (typeof this.props.sendDisabled !== 'undefined') {
            if (this.props.sendDisabled == false) {
                return null;
            }
        }

        return <input
            readOnly={this.props.readonly}
            name={this.props.name}
            checked={this.isOnChange ? !this.props.checked : !this.state.checked}
            onChange={() => { }}
            type="checkbox"
            style={{ display: 'none' }}
            value={this.props.valueOff ? this.props.valueOff : '0'}
        />
    }

    render() {
        return <>
            {this.getDisabledElement()}
            <label className={this.props.placeholder ? "form-switch" : "form-switch not-placeholder"}>
                <input
                    name={this.props.name}
                    onChange={this.onChange}
                    checked={this.isOnChange ? this.props.checked : this.state.checked}
                    value={this.props.value}
                    readOnly={this.props.readonly}
                    type="checkbox"
                    className="form-check-input"
                />
                {
                    this.props.placeholder
                        ? <div className="form-check-label">{this.props.placeholder}</div>
                        : ''
                }
            </label>
        </>
    }

}

export default Switch;