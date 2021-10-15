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
    axios.get(this.props.url).then(response => {
      this.setState({
        options: response.data.paginate.data
      });
    });
  }

  onChange = event => {
    if (this.isOnChange) {
      this.props.onChange(event.target.value);
    } else {
      this.setState({
        value: event.target.value
      });
    }
  };

  render() {
    return /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      name: this.props.name,
      onChange: this.onChange,
      value: this.isOnChange ? this.props.value ? this.props.value : '' : this.state.value
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, this.props.placeholder ? this.props.placeholder : '- Выбрать -'), (this.props.options ? this.props.options : this.state.options).map(option => {
      var value = option.id ? option.id : option.value ? option.value : '';
      return /*#__PURE__*/React.createElement("option", {
        key: option.name + '_' + value,
        value: value
      }, option.name);
    }));
  }

}

export default Select;