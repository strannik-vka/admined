import React from "react";
import ReactSelect from 'react-select';

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

    onChange = (selectedOption) => {
        let value = selectedOption !== null ? selectedOption.value : null;

        if (Array.isArray(selectedOption)) {
            value = [];

            selectedOption.forEach(element => {
                value.push(element.value);
            });
        }

        if (this.isOnChange) {
            this.props.onChange(value);
        } else {
            this.setState({
                value: value
            });
        }
    }

    render() {
        var multiple = this.props.name.indexOf('[]') > -1,
            value = this.isOnChange ? (typeof this.props.value !== 'undefined' ? this.props.value : '') : this.state.value,
            options = this.props.options ? this.props.options : this.state.options,
            placeholder = null,
            valueIsArray = typeof value === 'object' && value != null,
            defaultValue = valueIsArray ? [] : null;

        if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
            placeholder = this.props.placeholder ? this.props.placeholder : '- Выбрать -';
        }

        options.map(option => {
            option.value = typeof option === 'string' ? option : (
                typeof option.id !== 'undefined' ? option.id : (
                    typeof option.value !== 'undefined' ? option.value : ''
                )
            );

            option.label = typeof option === 'string' ? option : (
                typeof this.props.text_key !== 'undefined' ? option[this.props.text_key] : option.name
            );

            if (valueIsArray) {
                if (value.indexOf('' + option.value + '') > -1 || value.indexOf(option.value) > -1) {
                    defaultValue.push(option);
                }
            } else {
                if (option.value === value) {
                    defaultValue = option;
                }
            }

            return option;
        });

        return <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder={placeholder}
            defaultValue={defaultValue}
            isDisabled={this.props.readonly}
            isMulti={multiple}
            name={this.props.name}
            onChange={this.onChange}
            options={options}
            isClearable={true}
        />
    }

}

export default Select;