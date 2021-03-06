import React from "react";
import ReactSelect from 'react-select';

const axios = require('axios').default;

class Select extends React.Component {

    constructor(props) {
        super(props);

        this.localOptions = this.getLocalOptions();

        this.state = {
            isLoading: false,
            ajaxOptions: null,
            value: typeof this.props.value !== 'undefined' ? this.props.value : ''
        }
    }

    getLocalOptions = () => {
        let options = [],
            ids = [];

        if (Array.isArray(this.props.value)) {
            this.props.value.forEach(option => {
                if (isObject(option)) {
                    let localOption = {};

                    localOption.id = typeof option.id !== 'undefined' ? option.id : (
                        typeof option.value !== 'undefined' ? option.value : ''
                    )

                    localOption.name = typeof option.name !== 'undefined' ? option.name : (
                        typeof option.title !== 'undefined' ? option.title : ''
                    )

                    if (localOption.id && localOption.name) {
                        ids.push(localOption.id);
                        options.push(localOption);
                    }
                }
            });
        }

        return {
            ids: ids,
            options: options
        }
    }

    ajaxPreloader = (callback) => {
        if (this.state.isLoading != true) {
            this.setState({
                isLoading: true
            }, callback);
        } else {
            callback();
        }
    }

    getAjaxOptions = (name, callback) => {
        this.ajaxPreloader(() => {
            let config = {};

            if (typeof name !== 'undefined') {
                config.params = {
                    name: name
                };
            }

            if (this.ajaxTimer) {
                clearTimeout(this.ajaxTimer);
            }

            this.ajaxTimer = setTimeout(() => {
                axios.get(this.props.url, config).then(response => {
                    callback(response.data.paginate.data);
                });
            }, 1000);
        });
    }

    onInputChange = (value) => {
        if (value && this.props.url) {
            this.getAjaxOptions(value, options => {
                let propsOptions = JSON.stringify([...this.props.options, ...this.localOptions.options]);

                options = options.filter(option => {
                    return propsOptions.indexOf('"id":' + option.id + '') == -1;
                });

                this.setState({
                    isLoading: false,
                    ajaxOptions: options
                });
            });
        }
    }

    onChange = (selectedOption) => {
        let value = selectedOption !== null ? selectedOption.value : '';

        if (Array.isArray(selectedOption)) {
            value = [];

            selectedOption.forEach(element => {
                value.push(element.value);
            });
        }

        if (this.props.onChange) {
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

    isErrors = () => {
        if (typeof this.props.errors === 'object' && this.props.errors != null) {
            return Object.keys(this.props.errors).length;
        }

        return false;
    }

    isMultiple = () => {
        return this.props.name.indexOf('[]') > -1;
    }

    getPlaceholder = () => {
        let result = null;

        if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
            result = this.props.placeholder ? this.props.placeholder : '- ?????????????? -';
        }

        return result;
    }

    getValue = (propsValue) => {
        let result = '';

        if (this.props.onChange) {
            if (typeof propsValue !== 'undefined') {
                if (this.localOptions.ids.length) {
                    result = this.localOptions.ids;
                } else {
                    result = propsValue;
                }
            }
        } else {
            result = this.state.value;
        }

        return result;
    }

    formatOptions = ({ options, labelKey, value }) => {
        let defaultValue = Array.isArray(value) ? [] : null;

        options = Array.isArray(options) ? options.map(option => {
            let result = {};

            if (typeof option === 'string') {
                result.value = option;
                result.label = option;
            } else {
                result.value = typeof option.id !== 'undefined' ? option.id : (
                    typeof option.value !== 'undefined' ? option.value : ''
                );

                result.label = labelKey ? option[labelKey] : option.name
            }

            if (typeof value !== 'undefined') {
                if (Array.isArray(value)) {
                    if (value.indexOf('' + result.value + '') > -1 || value.indexOf(result.value) > -1) {
                        defaultValue.push(result);
                    }
                } else {
                    let val1 = !isNaN(value) ? parseFloat(value) : value,
                        val2 = !isNaN(result.value) ? parseFloat(result.value) : result.value;

                    if (val1 === val2) {
                        defaultValue = result;
                    }
                }
            }

            if (option.options) {
                result.options = option.options;
            }

            return result;
        }) : [];

        return {
            defaultValue: defaultValue,
            options: options
        }
    }

    render() {
        let options = [...this.props.options, ...this.localOptions.options];

        if (this.state.ajaxOptions) {
            options = [...this.state.ajaxOptions, ...options];
        }

        let value = this.getValue(this.props.value),
            multiple = this.isMultiple(),
            formatOptions = this.formatOptions({
                value: value,
                options: options,
                labelKey: this.props.text_key
            });

        return <>
            <ReactSelect
                key={this.props.name + '_' + JSON.stringify(value)}
                className={'react-select-container' + (this.isErrors() ? ' is-invalid' : '')}
                classNamePrefix="react-select"
                placeholder={this.getPlaceholder()}
                defaultValue={formatOptions.defaultValue}
                isDisabled={this.props.readonly}
                isMulti={multiple}
                name={this.props.name}
                onChange={this.onChange}
                onInputChange={this.onInputChange}
                options={formatOptions.options}
                isClearable={true}
                closeMenuOnSelect={!multiple}
                isLoading={this.state.isLoading}
                loadingMessage={() => '????????????????..'}
                noOptionsMessage={() => '??????????..'}
            />
            {
                this.isErrors() ? <div className="invalid-feedback">{this.props.errors[0]}</div> : ''
            }
        </>
    }

}

export default Select;