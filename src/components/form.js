import React from "react";
import { CloseButton, Modal } from "react-bootstrap";
import FormFields from "./FormFields";

const axios = require('axios').default;

class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: []
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

    onSubmit = (e) => {
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
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            if (response.data.errors) {
                this.errorsAdd(response.data.errors);
            } else if (response.data.success) {
                this.props.onHide(response.data.success);
            }
        });
    }

    render() {
        return <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            size="xl"
            centered
        >
            <Modal.Body>
                <CloseButton onClick={this.props.onHide} />
                <form className="form-reverse" onSubmit={this.onSubmit}>
                    <FormFields
                        page={this.props.page}
                        inputs={this.props.page.form}
                        errors={this.state.errors}
                        errorHide={(name) => this.errorHide(name)}
                        editItem={this.props.editItem}
                    />
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn">Сохранить</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>;
    }

}

export default Form;