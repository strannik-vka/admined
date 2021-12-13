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

  files() {
    var result = [];

    if (typeof this.props.value === 'object' && this.props.value != null) {
      this.props.value.forEach((file, i) => {
        result.push( /*#__PURE__*/React.createElement("a", {
          href: file,
          target: "_blank",
          class: "download_file"
        }, "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0444\u0430\u0439\u043B ", i + 1));
      });
    } else if (this.props.value) {
      result.push( /*#__PURE__*/React.createElement("a", {
        href: this.props.value,
        target: "_blank",
        class: "download_file"
      }, "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0444\u0430\u0439\u043B"));
    }

    return result;
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, this.files(), /*#__PURE__*/React.createElement("input", {
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