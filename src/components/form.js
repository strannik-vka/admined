import React from "react";
import { CloseButton, Modal } from "react-bootstrap";
import Input from "./form/input";
import Select from "./form/select";
import Switch from "./form/switch";
import File from "./form/file";
import TextEditor from "./form/texteditor";
import Textarea from "./form/textarea";

const axios = require('axios').default;

class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: []
        }
    }

    switch(input) {
        return (
            <Switch
                name={input.name}
                checked={(this.props.editItem[input.name] ? this.props.editItem[input.name] : input.checked) === 1}
                placeholder={input.placeholder}
                value="1"
            />
        );
    }

    select(input) {
        return (
            <Select
                options={this.props.page.vars[input.name.replace('_id', '')]}
                name={input.name}
                url={input.url}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    file(input) {
        return (
            <File name={input.name} errors={this.state.errors[input.name]} errorHide={() => this.errorHide(input.name)} />
        );
    }

    text(input) {
        return (
            <Textarea
                name={input.name}
                errors={this.state.errors[input.name]}
                onInput={() => this.errorHide(input.name)}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    texteditor(input) {
        return (
            <TextEditor
                name={input.name}
                errors={this.state.errors[input.name]}
                onInput={() => this.errorHide(input.name)}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    string(input) {
        return (
            <Input
                type={input.type}
                name={input.name}
                errors={this.state.errors[input.name]}
                errorHide={() => this.errorHide(input.name)}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    datetime(input) {
        return (
            <Input
                type={input.type}
                name={input.name}
                errors={this.state.errors[input.name]}
                errorHide={() => this.errorHide(input.name)}
                value={
                    this.props.editItem[input.name]
                        ? this.props.editItem[input.name]
                        : (
                            typeof input.value === 'function'
                                ? input.value()
                                : input.value
                        )
                }
            />
        );
    }

    errorHide = (name) => {
        if (this.state.errors[name]) {
            delete this.state.errors[name];

            this.setState({
                errors: this.state.errors
            });
        }
    }

    formGroups() {
        return this.props.page.form.map((input) => {
            var type = input.type ? input.type : 'string';

            return (
                input.readonly ? false :
                    <div key={input.name} className="form-group mb-3">
                        {type === 'switch' ? '' : <label>{input.placeholder}</label>}
                        {this[type](input)}
                    </div>
            );
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
                this.setState({
                    errors: response.data.errors
                });
            } else if (response.data.success) {
                this.props.onHide(response.data.success);
            }
        });
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                centered
            >
                <Modal.Body>
                    <CloseButton onClick={this.props.onHide} />
                    <form className="form-reverse" onSubmit={this.onSubmit}>
                        {this.formGroups()}
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn">Сохранить</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }

}

export default Form;