import React from "react";
import Input from "./input";
import Fieldsets from "./fieldsets";

class Poll extends React.Component {
  constructor(props) {
    super(props);
    this.question = this.props.value && this.props.value.question ? this.props.value.question : null;
  }

  getFieldsetsInput() {
    return {
      name: this.props.name + '[variant][]',
      placeholder: 'Вариант ответа',
      type: 'array',
      fields: [{
        name: this.props.name + '[variant][]',
        type: 'string'
      }]
    };
  }

  getFields() {
    let result = [];

    if (this.props.value && this.props.value.variant) {
      this.props.value.variant.forEach(value => {
        result.push({
          name: this.props.name + '[variant][]',
          variant: value
        });
      });
    }

    return result;
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "form-group mb-3"
    }, /*#__PURE__*/React.createElement("label", null, "\u0412\u043E\u043F\u0440\u043E\u0441"), /*#__PURE__*/React.createElement(Input, {
      name: this.props.name + '[question]',
      value: this.question
    })), /*#__PURE__*/React.createElement(Fieldsets, {
      input: this.getFieldsetsInput(),
      fields: this.getFields()
    }));
  }

}

export default Poll;