import axios from "axios";
import React from "react";
import ReactSelect, { components } from 'react-select';
import InvalidText from "../../shared/ui/form/InvalidText";
import { isObject } from "../../shared/lib/isObject";
import { URLParam } from "../../shared/lib/URLParam";
import { hasStorage, storage } from "../../shared/lib/Storage";

class Select extends React.Component {

    constructor(props) {
        super(props);

        this.localOptions = this.getLocalOptions();
        this.storageOptions = this.getStorageOptions();

        this.state = {
            isLoading: false,
            ajaxOptions: null,
            value: typeof this.props.value !== 'undefined' ? this.props.value : ''
        }
    }

    getOptionDescription = (item) => {
        if (typeof this.props.optionDescription === 'function') {
            return this.props.optionDescription(item);
        } else if (typeof this.props.optionDescription === 'string') {
            return item[this.props.optionDescription];
        }

        return null;
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

                    if (this.props.optionDescription) {
                        localOption.description = this.getOptionDescription(option);
                    }

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

    getStorageOptions = () => {
        let options = [],
            ids = [];

        const inputKey = URLParam('url') + '_' + this.props.name;

        if (hasStorage(inputKey) && hasStorage(inputKey + '_option')) {
            const storageOptions = storage(inputKey + '_option');

            if (Array.isArray(storageOptions)) {
                storageOptions.forEach(storageOption => {
                    if (isObject(storageOption)) {
                        let localOption = {
                            id: storageOption.value,
                            name: storageOption.label,
                        }

                        if (storageOption.description) {
                            localOption.description = storageOption.description;
                        }

                        if (localOption.id && localOption.name) {
                            ids.push(localOption.id);
                            options.push(localOption);
                        }
                    }
                })
            } else {
                const storageOption = storageOptions;

                if (isObject(storageOption)) {
                    let localOption = {
                        id: storageOption.value,
                        name: storageOption.label,
                    }

                    if (storageOption.description) {
                        localOption.description = storageOption.description;
                    }

                    if (localOption.id && localOption.name) {
                        ids.push(localOption.id);
                        options.push(localOption);
                    }
                }
            }
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
                    return propsOptions.indexOf('"id":' + option.id + ',') === -1;
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

            this.props.onChange(value, selectedOption);
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
        return this.props.name ? this.props.name.indexOf('[]') > -1 || this.props.multiple : this.props.multiple;
    }

    getPlaceholder = () => {
        let result = null;

        if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
            result = this.props.placeholder ? this.props.placeholder : '- Выбрать -';
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

    getDefaultValue(value, result) {
        const childOptions = (value, result) => {
            if (Array.isArray(result.options)) {
                let childResult = false;

                for (let i = 0; i < result.options.length; i++) {
                    let defaultValue = this.getDefaultValue(value, result.options[i]);

                    if (defaultValue !== false) {
                        childResult = defaultValue;
                        break;
                    }
                }

                return childResult;
            }

            return false;
        }

        if (typeof value !== 'undefined') {
            if (Array.isArray(value)) {
                if (value.indexOf('' + result.value + '') > -1 || value.indexOf(result.value) > -1) {
                    return result;
                }

                return childOptions(value, result);
            } else {
                let val1 = !isNaN(value) ? parseFloat(value) : value,
                    val2 = !isNaN(result.value) ? parseFloat(result.value) : result.value;

                if (val1 === val2) {
                    return result;
                }

                return childOptions(value, result);
            }
        }

        return false;
    }

    formatOptions = ({ options, labelKey, value }) => {
        let defaultValue = Array.isArray(value) ? [] : null;

        options = Array.isArray(options) ?
            options.map(option => {
                let result = {};

                if (option.options) {
                    result.options = option.options;
                }

                if (typeof option === 'string') {
                    result.value = option;
                    result.label = option;
                } else {
                    result.value = typeof option.id !== 'undefined' ? option.id : (
                        typeof option.value !== 'undefined' ? option.value : ''
                    );

                    result.label = labelKey ? option[labelKey] : option.name

                    if (this.props.optionDescription) {
                        result.description = this.getOptionDescription(option);
                    }
                }

                let optionDefaultValue = this.getDefaultValue(value, result);
                if (optionDefaultValue !== false) {
                    if (Array.isArray(defaultValue)) {
                        defaultValue.push(optionDefaultValue);
                    } else {
                        defaultValue = optionDefaultValue;
                    }
                }

                return result;
            }) : [];

        options.map(option => {
            if (typeof option.label == 'string') {
                option.label = option.label
                    .replace(/&nbsp;/g, ' ')
                    .replace(/<br>/g, ' ')
                    .replace(/<br\/>/g, ' ')
                    .replace(/<br \/>/g, ' ');
            }

            return option;
        });

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

        if (this.storageOptions.options.length) {
            this.storageOptions.options.forEach(option => {
                const findOption = options.find((item) => item.id === option.id);

                if (!findOption) {
                    options.push(option);
                }
            })
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
                loadingMessage={() => 'Загрузка..'}
                noOptionsMessage={() => 'Пусто..'}
                components={{
                    ClearIndicator: ({ ...props }) => (
                        <components.ClearIndicator {...props} >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 10L6 14M10 10L14 6M10 10L14 14M10 10L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </components.ClearIndicator>
                    ),
                    DropdownIndicator: ({ ...props }) => (
                        <components.DropdownIndicator {...props}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="10" y1="12.0858" x2="14.5858" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="5.41421" y1="7.5" x2="10" y2="12.0858" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </components.DropdownIndicator>
                    ),
                    Option: ({ ...props }) => {
                        return (
                            <components.Option {...props}>
                                {props.label}
                                {props.data.description && <>
                                    <br />
                                    <small>{props.data.description}</small>
                                </>}
                            </components.Option>
                        )
                    }
                }}
            />
            <InvalidText errors={this.props.errors} />
        </>
    }

}

export default Select;