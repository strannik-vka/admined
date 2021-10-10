import React from "react";

class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      name: this.props.name,
      type: "text",
      className: this.props.errors ? 'form-control is-invalid' : 'form-control',
      onInput: this.props.errorHide,
      value: this.props.value
    }), this.props.errors ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default Input;