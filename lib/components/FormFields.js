import React from "react";
import Input from "./form/input";
import Select from "./form/select";
import Switch from "./form/switch";
import File from "./form/file";
import TextEditor from "./form/texteditor";
import Textarea from "./form/textarea";
import Fieldsets from "./form/fieldsets";

class FormFields extends React.Component {
  constructor(props) {
    super(props);
  }

  switch(input) {
    return /*#__PURE__*/React.createElement(Switch, {
      name: input.name,
      checked: (this.props.editItem[input.name] ? this.props.editItem[input.name] : input.checked) === 1,
      placeholder: input.placeholder,
      value: "1"
    });
  }

  select(input) {
    return /*#__PURE__*/React.createElement(Select, {
      options: this.props.page.vars[input.name.replace('_id', '')],
      name: input.name,
      url: input.url,
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value,
      text_key: input.text_key
    });
  }

  file(input) {
    return /*#__PURE__*/React.createElement(File, {
      multiple: input.multiple,
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name)
    });
  }

  text(input) {
    return /*#__PURE__*/React.createElement(Textarea, {
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  texteditor(input) {
    return /*#__PURE__*/React.createElement(TextEditor, {
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  string(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  datetime(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : typeof input.value === 'function' ? input.value() : input.value
    });
  }

  array(input) {
    return /*#__PURE__*/React.createElement(Fieldsets, {
      input: input,
      editItem: this.props.editItem
    });
  }

  getError(name) {
    return this.props.errors && this.props.errors[name] ? this.props.errors[name] : null;
  }

  errorHide(name) {
    if (this.props.errorHide) {
      this.props.errorHide(name);
    }
  }

  render() {
    return this.props.inputs.map(input => {
      return input.readonly ? false : /*#__PURE__*/React.createElement("div", {
        key: input.name,
        className: "form-group mb-3"
      }, input.type !== 'switch' ? /*#__PURE__*/React.createElement("label", null, input.placeholder) : '', input.description ? /*#__PURE__*/React.createElement("div", {
        className: "description"
      }, input.description) : '', this[input.type](input));
    });
  }

}

export default FormFields;