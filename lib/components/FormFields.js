import React from "react";
import Input from "./input";
import Select from "./select";
import Switch from "./switch";
import File from "./file";
import TextEditor from "./texteditor";
import Textarea from "./textarea";
import Fieldsets from "./fieldsets";
import Constructor from "./constructor";

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
      name: input.name,
      value: this.getValue(input),
      options: this.props.page.vars[input.name.replace('_id', '').replace('[]', '')],
      text_key: input.text_key,
      url: input.url,
      errors: this.getError(input.name),
      onChange: () => this.errorHide(input.name)
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

  _constructor(input) {
    return /*#__PURE__*/React.createElement(Constructor, {
      name: input.name,
      screen: input.screen,
      fields: input.fields,
      defaultFields: input.defaultFields,
      value: this.getValue(input)
    });
  }

  array(input) {
    return /*#__PURE__*/React.createElement(Fieldsets, {
      input: input,
      editItem: this.props.editItem,
      fields: this.props.fields
    });
  }

  getValue(input) {
    let value = getDataValue(input.name.replace('[]', ''), this.props.editItem);
    value = value !== null ? value : input.value;

    if (input.type == 'datetime') {
      if (typeof input.value === 'function') {
        value = input.value();
      } else if (value == 'now') {
        value = nowDateTime();
      }
    }

    return value;
  }

  getError(name) {
    let inputName = name.replace('[]', '');
    return this.props.errors && this.props.errors[inputName] ? this.props.errors[inputName] : null;
  }

  errorHide(name) {
    if (this.props.errorHide) {
      this.props.errorHide(name.replace('[]', ''));
    }
  }

  render() {
    return this.props.inputs.map(input => {
      return input.readonly ? false : /*#__PURE__*/React.createElement("div", {
        key: input.name,
        className: "form-group mb-3"
      }, input.type !== 'switch' && input.placeholder ? /*#__PURE__*/React.createElement("label", null, input.placeholder) : '', input.description ? /*#__PURE__*/React.createElement("div", {
        className: "description"
      }, input.description) : '', this[input.type](input));
    });
  }

}

export default FormFields;