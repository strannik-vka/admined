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

        return (
            <Switch
                name={input.name}
                checked={(value ? value : input.checked) === 1}
                placeholder={input.placeholder}
                value="1"
            />
        );
    }

    select(input) {
        return (
            <Select
                name={input.name}
                value={this.getValue(input)}
                options={this.props.page.vars[input.name.replace('_id', '').replace('[]', '')]}
                text_key={input.text_key}
                url={input.url}
                errors={this.getError(input.name)}
                onChange={() => this.errorHide(input.name)}
            />
        );
    }

    file(input) {
        var name = input.name;

        if (input.upload_queue) {
            if (name.indexOf('[') == -1) {
                name += '[]';
            }
        }

        return (
            <File
                multiple={input.multiple}
                name={name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.getValue(input)}
            />
        );
    }

    text(input) {
        return (
            <Textarea
                name={input.name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.getValue(input)}
            />
        );
    }

    texteditor(input) {
        return (
            <TextEditor
                name={input.name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.getValue(input)}
            />
        );
    }

    string(input) {
        return (
            <Input
                type={input.type}
                name={input.name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.getValue(input)}
            />
        );
    }

    datetime(input) {
        return (
            <Input
                type={input.type}
                name={input.name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.getValue(input)}
            />
        );
    }

    _constructor(input) {
        return <Constructor
            name={input.name}
            screen={input.screen}
            fields={input.fields}
            defaultFields={input.defaultFields}
            value={this.getValue(input)}
        />
    }

    array(input) {
        return <Fieldsets
            input={input}
            editItem={this.props.editItem}
            fields={this.props.fields}
        />
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
            return (
                input.readonly ? false :
                    <div key={input.name} className="form-group mb-3">
                        {input.type !== 'switch' && input.placeholder ? <label>{input.placeholder}</label> : ''}
                        {input.description ? <div className="description">{input.description}</div> : ''}
                        {this[input.type](input)}
                    </div>
            );
        });
    }

}

export default FormFields;