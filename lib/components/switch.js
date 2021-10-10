import React from "react";

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }

  onChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  render() {
    return /*#__PURE__*/React.createElement("label", {
      className: "form-check form-switch"
    }, /*#__PURE__*/React.createElement("input", {
      name: this.props.name,
      onChange: this.onChange,
      checked: this.state.checked,
      type: "checkbox",
      className: "form-check-input",
      value: this.props.value
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-check-label"
    }, this.props.placeholder));
  }

}

export default Switch;