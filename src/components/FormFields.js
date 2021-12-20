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
                text_key={input.text_key}
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
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    text(input) {
        return (
            <Textarea
                name={input.name}
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
            />
        );
    }

    texteditor(input) {
        return (
            <TextEditor
                name={input.name}
                errors={this.getError(input.name)}
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
                errors={this.getError(input.name)}
                onInput={() => this.errorHide(input.name)}
                value={this.props.editItem[input.name] ? this.props.editItem[input.name] : input.value}
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

    array(input) {
        return <Fieldsets
            input={input}
            editItem={this.props.editItem}
        />;
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
            return (
                input.readonly ? false :
                    <div key={input.name} className="form-group mb-3">
                        {input.type !== 'switch' ? <label>{input.placeholder}</label> : ''}
                        {input.description ? <div className="description">{input.description}</div> : ''}
                        {this[input.type](input)}
                    </div>
            );
        });
    }

}

export default FormFields;