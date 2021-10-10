import React from "react";

class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 4
    };
  }

  onKeyPress = e => {
    var rows = e.target.value.split("\n").length;
    this.setState({
      rows: rows > 4 ? rows : 4
    });
  };

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      name: this.props.name,
      className: this.props.errors ? 'form-control is-invalid' : 'form-control',
      onKeyDown: this.onKeyPress,
      onKeyUp: this.onKeyPress,
      onInput: this.props.errorHide,
      rows: this.state.rows
    }), this.props.errors ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default Textarea;