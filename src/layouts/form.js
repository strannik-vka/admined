import React from "react";
import FormFields from "../components/formFields";
import Modal from "../components/modal";

const axios = require('axios').default;

class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ajaxProcess: false,
            errors: [],
            upload_queue_total: 0,
            upload_queue_success: 0,
        }
    }

    errorsAdd = (errors) => {
        this.setState({
            errors: errors
        });
    }

    errorHide = (name) => {
        this.setState(prevState => {
            if (prevState.errors[name]) {
                delete prevState.errors[name];

                return {
                    errors: prevState.errors
                };
            }
        });
    }

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

    onSubmit = (e) => {
        e.preventDefault();

        var stateData = {
            ajaxProcess: true
        }

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
    }

    ajaxSend(obj) {
        var stateData = {
            ajaxProcess: false
        }

        axios({
            method: 'post',
            url: location.pathname + '/' + this.props.page.url + (this.props.editItem.id ? '/' + this.props.editItem.id : ''),
            data: obj.data,
            processData: false,
            contentType: false,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
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
                                upload_queue_total: 0,
                            }, () => {
                                this.props.formVisible(false);
                            });
                        } else {
                            setTimeout(() => {
                                this.onSubmit(obj.event);
                            }, 0);
                        }
                    } else {
                        this.props.formVisible(false);
                    }
                }
            });
        }).catch(() => {
            alert('Ошибка сервера');
            this.setState(stateData);
        });
    }

    render() {
        return <Modal
            show={this.props.show}
            onHide={() => this.props.formVisible(false)}
        >
            <form id="itemsForm" key={JSON.stringify(this.props.editItem)} className="form-reverse" onSubmit={this.onSubmit}>
                <FormFields
                    page={this.props.page}
                    inputs={this.props.page.form}
                    errors={this.state.errors}
                    errorHide={(name) => this.errorHide(name)}
                    editItem={this.props.editItem}
                />
                <div className="d-flex justify-content-end align-items-center">
                    {this.getUploadQueueName() && this.state.ajaxProcess ? <div className="upload_queue_text">Успешно {this.state.upload_queue_success} из {this.state.upload_queue_total}</div> : ''}
                    {this.props.isPreview ? <button style={{ marginRight: '1rem' }} onClick={() => this.props.previewVisible(true)} type="button" className="btn">Предпросмотр</button> : ''}
                    <button type="submit" className="btn">{this.state.ajaxProcess ? 'Подождите..' : 'Сохранить'}</button>
                </div>
            </form>
        </Modal>
    }

}

export default Form;