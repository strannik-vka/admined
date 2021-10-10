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
        return (
            <select
                className="form-control w-100"
                name={this.props.name}
                onChange={this.onChange}
                value={this.isOnChange ? (this.props.value ? this.props.value : '') : this.state.value}
            >
                <option value="">- Выбрать -</option>
                {
                    (this.props.options ? this.props.options : this.state.options).map((option) => {
                        var value = option.id ? option.id : (option.value ? option.value : '');

                        return (
                            <option key={option.name + '_' + value} value={value}>{option.name}</option>
                        );
                    })
                }
            </select>
        );
    }

}

export default Select;