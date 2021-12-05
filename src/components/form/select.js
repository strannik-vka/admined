import React from "react";

const axios = require('axios').default;

class Select extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            value: this.props.value ? this.props.value : ''
        };

        if (this.props.url) {
            this.getOptions();
        }

        this.isOnChange = typeof this.props.onChange === 'function';
    }

    getOptions() {
        axios.get(this.props.url).then((response) => {
            this.setState({
                options: response.data.paginate.data
            });
        });
    }

    onChange = (event) => {
        if (this.isOnChange) {
            this.props.onChange(event.target.value);
        } else {
            this.setState({
                value: event.target.value
            });
        }
    }

    render() {
        var defaultOption = null;

        if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
            defaultOption = <option value="">{this.props.placeholder ? this.props.placeholder : '- Выбрать -'}</option>;
        }

        return (
            <select
                className="form-control"
                disabled={this.props.readonly}
                name={this.props.name}
                onChange={this.onChange}
                value={this.isOnChange ? (typeof this.props.value !== 'undefined' ? this.props.value : '') : this.state.value}
            >
                {defaultOption}
                {
                    (this.props.options ? this.props.options : this.state.options).map((option) => {
                        var value = typeof option === 'string' ? option : (
                            typeof option.id !== 'undefined' ? option.id : (
                                typeof option.value !== 'undefined' ? option.value : ''
                            )
                        ), name = typeof option === 'string' ? option : (
                            typeof this.props.text_key !== 'undefined' ? option[this.props.text_key] : option.name
                        );

                        return (
                            <option key={name + '_' + value} value={value}>{name}</option>
                        );
                    })
                }
            </select>
        );
    }

}

export default Select;