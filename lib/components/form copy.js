import React from "react";
import { CloseButton, Modal } from "react-bootstrap";
import Input from "./form/input";
import Select from "./form/select";
import Switch from "./form/switch";
import File from "./form/file";
import TextEditor from "./form/texteditor";
import Textarea from "./form/textarea";
import Fieldsets from "./form/fieldsets";

const axios = require('axios').default;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };
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
      errors: this.state.errors[input.name],
      errorHide: () => this.errorHide(input.name)
    });
  }

  text(input) {
    return /*#__PURE__*/React.createElement(Textarea, {
      name: input.name,
      errors: this.state.errors[input.name],
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  texteditor(input) {
    return /*#__PURE__*/React.createElement(TextEditor, {
      name: input.name,
      errors: this.state.errors[input.name],
      onInput: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  string(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.state.errors[input.name],
      errorHide: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value
    });
  }

  datetime(input) {
    return /*#__PURE__*/React.createElement(Input, {
      type: input.type,
      name: input.name,
      errors: this.state.errors[input.name],
      errorHide: () => this.errorHide(input.name),
      value: this.props.editItem[input.name] ? this.props.editItem[input.name] : typeof input.value === 'function' ? input.value() : input.value
    });
  }

  array(input) {
    return /*#__PURE__*/React.createElement(Fieldsets, {
      input: input,
      editItem: this.props.editItem,
      formGroups: fields => this.formGroups(fields)
    });
  }

  errorHide = name => {
    this.setState(prevState => {
      if (prevState.errors[name]) {
        delete prevState.errors[name];
        return {
          errors: prevState.errors
        };
      }
    });
  };

  formGroups(inputs) {
    return inputs.map(input => {
      return input.readonly ? false : /*#__PURE__*/React.createElement("div", {
        key: input.name,
        className: "form-group mb-3"
      }, input.type !== 'switch' ? /*#__PURE__*/React.createElement("label", null, input.placeholder) : '', input.description ? /*#__PURE__*/React.createElement("div", {
        className: "description"
      }, input.description) : '', this[input.type](input));
    });
  }

  onSubmit = e => {
    e.preventDefault();
    var data = new FormData(e.target);

    if (this.props.editItem.id) {
      data.append('_method', 'PUT');
    }

    axios({
      method: 'post',
      url: location.pathname + '/' + this.props.page.url + (this.props.editItem.id ? '/' + this.props.editItem.id : ''),
      data: data,
      processData: false,
      contentType: false,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.errors) {
        this.setState({
          errors: response.data.errors
        });
      } else if (response.data.success) {
        this.props.onHide(response.data.success);
      }
    });
  };

  render() {
    return /*#__PURE__*/React.createElement(Modal, {
      show: this.props.show,
      onHide: this.props.onHide,
      size: "xl",
      centered: true
    }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(CloseButton, {
      onClick: this.props.onHide
    }), /*#__PURE__*/React.createElement("form", {
      className: "form-reverse",
      onSubmit: this.onSubmit
    }, this.formGroups(this.props.page.form), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn"
    }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")))));
  }

}

export default Form;