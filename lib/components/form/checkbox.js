function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("label", {
      className: "form-check not-label"
    }, /*#__PURE__*/React.createElement("input", _extends({}, this.props, {
      className: "form-check-input",
      type: "checkbox"
    })));
  }

}

export default Checkbox;