import React from "react";

class Textarea extends React.Component {
  constructor(props) {
    super(props);
    var value = this.props.value ? this.props.value : '',
        rows = this.getRows(value);
    this.state = {
      rows: rows > 4 ? rows : 4,
      value: value
    };
  }

  getRows(str) {
    return str.split("\n").length;
  }

  onKeyPress = e => {
    var rows = this.getRows(e.target.value);
    this.setState({
      rows: rows > 4 ? rows : 4
    });
  };
  onInput = event => {
    this.setState({
      value: event.target.value
    });
    this.props.errorHide(event);
  };

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      name: this.props.name,
      className: this.props.errors ? 'form-control is-invalid' : 'form-control',
      onKeyDown: this.onKeyPress,
      onKeyUp: this.onKeyPress,
      onInput: this.onInput,
      rows: this.state.rows,
      value: this.state.value
    }), this.props.errors ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default Textarea;