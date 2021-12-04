import React from "react";

class File extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = event => {
    if (this.props.onInput) {
      this.props.onInput(event);
    }
  };

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      className: this.props.errors ? 'form-control is-invalid' : 'form-control',
      onChange: this.onChange,
      type: "file",
      name: this.props.name,
      multiple: this.props.multiple
    }), this.props.errors ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default File;