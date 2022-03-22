import React from "react";
import Input from "../components/form/input";
import Select from "../components/form/select";
import Switch from "../components/form/switch";
import File from "../components/form/file";
import TextEditor from "../components/form/texteditor";
import Textarea from "../components/form/textarea";
import Fieldsets from "../components/form/fieldsets";

class FormFields extends React.Component {
  constructor(props) {
    super(props);
  }

  switch(input) {
    let value = this.getValue(input);
    return /*#__PURE__*/React.createElement(Switch, {
      name: input.name,
      checked: (value ? value : input.checked) === 1,
      placeholder: input.placeholder,
      value: "1"
    });
  }

  select(input) {
    return /*#__PURE__*/React.createElement(Select, {
      options: this.props.page.vars[input.name.replace('_id', '').replace('[]', '')],
      name: input.name,
      url: input.url,
      value: this.getValue(input),
      text_key: input.text_key
    });
  }

  file(input) {
    var name = input.name;

    if (input.upload_queue) {
      if (name.indexOf('[') == -1) {
        name += '[]';
      }
    }

    return /*#__PURE__*/React.createElement(File, {
      multiple: input.multiple,
      name: name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.getValue(input)
    });
  }

  text(input) {
    return /*#__PURE__*/React.createElement(Textarea, {
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.getValue(input)
    });
  }

  texteditor(input) {
    return /*#__PURE__*/React.createElement(TextEditor, {
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.getValue(input)
    });
  }

  string(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.getValue(input)
    });
  }

  datetime(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.getError(input.name),
      onInput: () => this.errorHide(input.name),
      value: this.getValue(input)
    });
  }

  array(input) {
    return /*#__PURE__*/React.createElement(Fieldsets, {
      input: input,
      editItem: this.props.editItem
    });
  }

  getValue(input) {
    let value = null,
        isNameArray = input.name.indexOf('[') > -1 && input.name.indexOf(']') > -1 && input.name.indexOf('[]') == -1;

    if (isNameArray) {
      value = getDataValue(input.name, this.props.editItem);
      value = value ? value : input.value;
    } else {
      value = this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value;
    }

    if (input.type == 'datetime') {
      if (typeof input.value === 'function') {
        value = input.value();
      }
    }

    return value;
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