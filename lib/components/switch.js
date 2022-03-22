import React from "react";

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
    this.isOnChange = typeof this.props.onChange === 'function';
  }

  onChange = event => {
    if (this.isOnChange) {
      this.props.onChange(event.target.checked ? 1 : 0);
    } else {
      this.setState({
        checked: event.target.checked
      });
    }
  };

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      readOnly: this.props.readonly,
      name: this.props.name,
      checked: this.isOnChange ? !this.props.checked : !this.state.checked,
      onChange: () => {},
      type: "checkbox",
      style: {
        display: 'none'
      },
      value: this.props.valueOff ? this.props.valueOff : '0'
    }), /*#__PURE__*/React.createElement("label", {
      className: this.props.placeholder ? "form-switch" : "form-switch not-placeholder"
    }, /*#__PURE__*/React.createElement("input", {
      name: this.props.name,
      onChange: this.onChange,
      checked: this.isOnChange ? this.props.checked : this.state.checked,
      value: this.props.value,
      readOnly: this.props.readonly,
      type: "checkbox",
      className: "form-check-input"
    }), this.props.placeholder ? /*#__PURE__*/React.createElement("div", {
      className: "form-check-label"
    }, this.props.placeholder) : ''));
  }

}

export default Switch;