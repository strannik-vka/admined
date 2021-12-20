import React from "react";
import { CloseButton, Modal } from "react-bootstrap";
import FormFields from "./FormFields";

const axios = require('axios').default;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ajaxProcess: false,
      errors: [],
      upload_queue_total: 0,
      upload_queue_success: 0
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

  getUploadQueueName() {
    if (this.props.editItem.id) {
      return false;
    }

    var result = false;
    this.props.page.form.forEach(input => {
      if (input.upload_queue) {
        result = input.name;
      }
    });

    if (result) {
      if (result.indexOf('[') == -1) {
        result += '[]';
      }
    }

    return result;
  }

  onSubmit = e => {
    e.preventDefault();
    var stateData = {
      ajaxProcess: true
    };
    var uploadQueueName = this.getUploadQueueName(),
        uploadQueueElem = uploadQueueName ? e.target.querySelector('[name="' + uploadQueueName + '"]') : false;

    if (uploadQueueName) {
      stateData.upload_queue_total = uploadQueueElem.files.length;
      uploadQueueElem.removeAttribute('name');
    }

    if (this.state.ajaxProcess) {
      return false;
    } else {
      this.setState(stateData);
    }

    var data = new FormData(e.target);

    if (this.props.editItem.id) {
      data.append('_method', 'PUT');
    }

    if (uploadQueueName) {
      uploadQueueElem.setAttribute('name', uploadQueueName);
      data.append(uploadQueueName.replace('[]', ''), uploadQueueElem.files[this.state.upload_queue_success]);
    }

    this.ajaxSend({
      uploadQueueName: uploadQueueName,
      data: data,
      event: e
    });
  };

  ajaxSend(obj) {
    axios({
      method: 'post',
      url: location.pathname + '/' + this.props.page.url + (this.props.editItem.id ? '/' + this.props.editItem.id : ''),
      data: obj.data,
      processData: false,
      contentType: false,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      var stateData = {
        ajaxProcess: false
      };

      if (obj.uploadQueueName) {
        stateData.upload_queue_success = this.state.upload_queue_success + 1;
      }

      this.setState(stateData, () => {
        if (response.data.errors) {
          this.errorsAdd(response.data.errors);
        } else if (response.data.success) {
          this.props.itemEdit(response.data.success);

          if (obj.uploadQueueName) {
            if (this.state.upload_queue_success == this.state.upload_queue_total) {
              this.setState({
                upload_queue_success: 0,
                upload_queue_total: 0
              }, () => {
                this.props.hideForm(false);
              });
            } else {
              setTimeout(() => {
                this.onSubmit(obj.event);
              }, 0);
            }
          } else {
            this.props.hideForm(false);
          }
        }
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(Modal, {
      show: this.props.show,
      onHide: this.props.hideForm,
      size: "xl",
      centered: true
    }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(CloseButton, {
      onClick: () => {
        this.props.hideForm(false);
      }
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
      className: "d-flex justify-content-end align-items-center"
    }, this.getUploadQueueName() && this.state.ajaxProcess ? /*#__PURE__*/React.createElement("div", {
      className: "upload_queue_text"
    }, "\u0423\u0441\u043F\u0435\u0448\u043D\u043E ", this.state.upload_queue_success, " \u0438\u0437 ", this.state.upload_queue_total) : '', /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn"
    }, this.state.ajaxProcess ? 'Подождите..' : 'Сохранить')))));
  }

}

export default Form;