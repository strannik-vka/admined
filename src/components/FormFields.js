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

        return <Switch
            name={input.name}
            checked={(value ? value : input.checked) === 1}
            placeholder={input.placeholder}
            value="1"
        />
    }

    select(input) {
        let options = [],
            nameWith = input.name.replace('_id', '');

        if (Array.isArray(this.props.page.vars[input.name.replace('_id', '').replace('[]', '')])) {
            options = Array.from(this.props.page.vars[input.name.replace('_id', '').replace('[]', '')]);
        }

        if (this.props.editItem[nameWith]) {
            let option = this.props.editItem[nameWith];

            if (JSON.stringify(options).indexOf('"id":' + option.id + '') == -1) {
                options.unshift(option);
            }
        }

        return <Select
            name={input.name}
            value={this.getValue(input)}
            options={options}
            text_key={input.text_key}
            url={input.url}
            errors={this.getError(input.name)}
            onChange={() => this.errorHide(input.name)}
        />
    }

    file(input) {
        var name = input.name;

        if (input.upload_queue) {
            if (name.indexOf('[') == -1) {
                name += '[]';
            }
        }

        return <File
            multiple={input.multiple}
            name={name}
            errors={this.getError(input.name)}
            onInput={() => this.errorHide(input.name)}
            value={this.getValue(input)}
        />
    }

    text(input) {
        return <Textarea
            name={input.name}
            errors={this.getError(input.name)}
            onInput={() => this.errorHide(input.name)}
            value={this.getValue(input)}
            max={input.max}
        />
    }

    texteditor(input) {
        return <TextEditor
            name={input.name}
            errors={this.getError(input.name)}
            onInput={() => this.errorHide(input.name)}
            value={this.getValue(input)}
        />
    }

    hidden(input) {
        return <Input
            type={input.type}
            name={input.name}
            value={this.getValue(input)}
        />
    }

    string(input) {
        return <Input
            type={input.type}
            name={input.name}
            errors={this.getError(input.name)}
            onInput={() => this.errorHide(input.name)}
            value={this.getValue(input)}
            max={input.max}
        />
    }

    datetime(input) {
        return <Input
            type={input.type}
            format={input.format}
            name={input.name}
            errors={this.getError(input.name)}
            onInput={() => this.errorHide(input.name)}
            value={this.getValue(input)}
        />
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
        let value = this.props.editItem[input.name];

        if (typeof value === 'undefined') {
            value = getDataValue(input.name.replace('[]', ''), this.props.editItem);
        }

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
        name = name.replace('[]', '');
        return this.props.errors && this.props.errors[name] ? this.props.errors[name] : null;
    }

    errorHide(name) {
        if (this.props.errorHide) {
            this.props.errorHide(name.replace('[]', ''));
        }
    }

    render() {
        return this.props.inputs.map(input => {
            if (!input.readonly) {
                let label = null,
                    description = null,
                    element = typeof this[input.type] !== 'undefined'
                        ? this[input.type](input)
                        : this.string(input);

                if (input.type !== 'switch' && input.placeholder) {
                    label = <label>{input.placeholder}</label>
                }

                if (input.description) {
                    description = <div
                        className="description"
                        dangerouslySetInnerHTML={{ __html: input.description }}
                    ></div>
                }

                return <div key={input.name} className={'form-group mb-3' + (input.max ? ' maxLength' : '')}>
                    {label}
                    {description}
                    {element}
                </div>
            }
        })
    }

}

export default FormFields;