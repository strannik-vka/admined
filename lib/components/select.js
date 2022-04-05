import React from "react";
import ReactSelect from 'react-select';

const axios = require('axios').default;

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxTimer = false;
    this.localOptionsIds = [];
    this.localOptions = this.getLocalOptions();
    this.state = {
      isLoading: this.props.url ? true : false,
      options: this.localOptions,
      value: this.props.value ? this.props.value : ''
    };

    if (this.props.url) {
      this.getOptions();
    }

    this.isOnChange = typeof this.props.onChange === 'function';
  }

  getLocalOptions() {
    let result = [];

    if (Array.isArray(this.props.value)) {
      this.props.value.forEach(option => {
        if (isObject(option)) {
          let localOption = {};
          localOption.id = typeof option.id !== 'undefined' ? option.id : typeof option.value !== 'undefined' ? option.value : '';
          localOption.name = typeof option.name !== 'undefined' ? option.name : typeof option.title !== 'undefined' ? option.title : '';

          if (localOption.id && localOption.name) {
            this.localOptionsIds.push(localOption.id);
            result.push(localOption);
          }
        }
      });
    }

    return result;
  }

  getOptions = name => {
    let config = {};

    if (typeof name !== 'undefined') {
      config.params = {
        name: name
      };
    }

    axios.get(this.props.url, config).then(response => {
      this.setState({
        options: [...response.data.paginate.data, ...this.localOptions],
        isLoading: false
      });
    });
  };
  onInputChange = value => {
    if (value) {
      this.setState({
        isLoading: true
      }, () => {
        if (this.ajaxTimer) clearTimeout(this.ajaxTimer);
        this.ajaxTimer = setTimeout(() => {
          this.getOptions(value);
        }, 1000);
      });
    }
  };
  onChange = selectedOption => {
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
  };

  isErrors() {
    if (typeof this.props.errors === 'object' && this.props.errors != null) {
      return Object.keys(this.props.errors).length;
    }

    return false;
  }

  render() {
    var multiple = this.props.name.indexOf('[]') > -1,
        value = this.isOnChange ? typeof this.props.value !== 'undefined' ? this.localOptionsIds.length ? this.localOptionsIds : this.props.value : '' : this.state.value,
        options = this.props.options ? this.props.options : this.state.options,
        options = Array.isArray(options) ? options : [],
        placeholder = null,
        valueIsArray = Array.isArray(value),
        defaultValue = valueIsArray ? [] : null;

    if (typeof this.props.defaultOption === 'undefined' || this.props.defaultOption !== false) {
      placeholder = this.props.placeholder ? this.props.placeholder : '- Выбрать -';
    }

    options = options.map(option => {
      let result = {};
      result.value = typeof option === 'string' ? option : typeof option.id !== 'undefined' ? option.id : typeof option.value !== 'undefined' ? option.value : '';
      result.label = typeof option === 'string' ? option : typeof this.props.text_key !== 'undefined' ? option[this.props.text_key] : option.name;

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
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReactSelect, {
      key: this.props.name + '_' + JSON.stringify(value),
      className: 'react-select-container' + (this.isErrors() ? ' is-invalid' : ''),
      classNamePrefix: "react-select",
      placeholder: placeholder,
      defaultValue: defaultValue,
      isDisabled: this.props.readonly,
      isMulti: multiple,
      name: this.props.name,
      onChange: this.onChange,
      onInputChange: this.onInputChange,
      options: options,
      isClearable: true,
      closeMenuOnSelect: !multiple,
      isLoading: this.state.isLoading,
      loadingMessage: () => 'Загрузка..',
      noOptionsMessage: () => 'Пусто..'
    }), this.isErrors() ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default Select;