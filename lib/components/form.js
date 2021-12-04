import React from "react";
import { CloseButton, Modal } from "react-bootstrap";
import FormFields from "./FormFields";

const axios = require('axios').default;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };
  }

  errorsAdd = errors => {
    this.setState({
      errors: errors
    });
  };
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
        this.errorsAdd(response.data.errors);
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
    }, /*#__PURE__*/React.createElement(FormFields, {
      page: this.props.page,
      inputs: this.props.page.form,
      errors: this.state.errors,
      errorHide: name => this.errorHide(name),
      editItem: this.props.editItem
    }), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn"
    }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")))));
  }

}

export default Form;