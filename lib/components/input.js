import React from "react";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ? this.props.value : '',
      isChange: false
    };
  }

  onInput = event => {
    this.setState({
      value: event.target.value,
      isChange: true
    }, () => {
      if (this.props.onInput) {
        this.props.onInput(event);
      }
    });
  };

  isErrors() {
    if (typeof this.props.errors === 'object' && this.props.errors != null) {
      return Object.keys(this.props.errors).length;
    }

    return false;
  }

  getValue() {
    let result = this.state.value;

    if (this.props.type == 'datetime' && this.state.isChange == false) {
      result = dateFormat(this.state.value);
    }

    return result;
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      name: this.props.name,
      type: "text",
      className: this.isErrors() ? 'form-control is-invalid' : 'form-control',
      onInput: this.onInput,
      value: this.getValue()
    }), this.isErrors() ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default Input;