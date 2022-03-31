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
        let value = selectedOption !== null ? selectedOption.value : '';

        if (Array.isArray(selectedOption)) {
            value = [];

            selectedOption.forEach(element => {
                value.push(element.value);
            });
        }

        if (this.isOnChange) {
            if (Array.isArray(value)) {
                if (value.length == 0) {
                    value = '';
                }
            }

            this.props.onChange(value);
        } else {
            this.setState({
                value: value
            });
        }
    }

    isErrors() {
        if (typeof this.props.errors === 'object' && this.props.errors != null) {
            return Object.keys(this.props.errors).length;
        }

        return false;
    }

    render() {
        var multiple = this.props.name.indexOf('[]') > -1,
            value = this.isOnChange ? (typeof this.props.value !== 'undefined' ? this.props.value : '') : this.state.value,
            options = this.props.options ? this.props.options : this.state.options,
            options = Array.isArray(options) ? options : [],
            placeholder = null,
            valueIsArray = Array.isArray(value),
            valueKey = valueIsArray ? value.split(',') : value,
            defaultValue = valueIsArray ? [] : null;

        if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
            placeholder = this.props.placeholder ? this.props.placeholder : '- Выбрать -';
        }

        options = options.map(option => {
            let result = {};

            result.value = typeof option === 'string' ? option : (
                typeof option.id !== 'undefined' ? option.id : (
                    typeof option.value !== 'undefined' ? option.value : ''
                )
            );

            result.label = typeof option === 'string' ? option : (
                typeof this.props.text_key !== 'undefined' ? option[this.props.text_key] : option.name
            );

            if (valueIsArray) {
                if (value.indexOf('' + result.value + '') > -1 || value.indexOf(result.value) > -1) {
                    defaultValue.push(result);
                }
            } else {
                if (result.value === value) {
                    defaultValue = result;
                }
            }

            return result;
        });

        return <>
            <ReactSelect
                key={this.props.name + '_' + valueKey}
                className={'react-select-container' + (this.isErrors() ? ' is-invalid' : '')}
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
            {
                this.isErrors()
                    ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                    : ''
            }
        </>
    }

}

export default Select;