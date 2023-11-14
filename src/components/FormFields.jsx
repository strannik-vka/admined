import React, { useCallback } from "react";
import Input from "./input";
import Select from "./select";
import SwitchComp from "./switch";
import File from "./File";
import TextEditor from "./texteditor";
import Textarea from "./textarea";
import Fieldsets from "./fieldsets";
import Constructor from "./constructor";

const FormFields = (props) => {
    const switchElem = (input) => {
        let value = getValue(input);

        return (
            <SwitchComp
                name={input.name}
                checked={(value ? value : input.checked) === 1}
                placeholder={input.placeholder}
                value="1"
            />
        )
    }

    const select = (input) => {
        let options = [],
            nameWith = input.name.replace('_id', '');

        if (Array.isArray(props.page.vars[input.name.replace('_id', '').replace('[]', '')])) {
            options = Array.from(props.page.vars[input.name.replace('_id', '').replace('[]', '')]);
        }

        if (props.editItem[nameWith]) {
            let option = props.editItem[nameWith];

            if (JSON.stringify(options).indexOf('"id":' + option.id + '') == -1) {
                options.unshift(option);
            }
        }

        return (
            <Select
                name={input.name}
                value={getValue(input)}
                options={options}
                text_key={input.text_key}
                url={input.url}
                errors={getError(input.name)}
                onChange={() => errorHide(input.name)}
            />
        )
    }

    const file = (input) => {
        var name = input.name;

        if (input.upload_queue) {
            if (name.indexOf('[') == -1) {
                name += '[]';
            }
        }

        const fileErrorHide = useCallback(() => {
            errorHide(input.name)
        }, []);

        return (
            <File
                multiple={input.multiple}
                name={name}
                errors={getError(input.name)}
                onInput={fileErrorHide}
                value={getValue(input)}
                deleteRequest={input.deleteRequest} />
        )
    }

    const text = (input) => {
        return (
            <Textarea
                name={input.name}
                errors={getError(input.name)}
                onInput={() => errorHide(input.name)}
                value={getValue(input)}
                max={input.max} />
        )
    }

    const texteditor = (input) => {
        return <TextEditor name={input.name} errors={getError(input.name)} onInput={() => errorHide(input.name)} value={getValue(input)} />;
    }

    const hidden = (input) => {
        return <Input type={input.type} name={input.name} value={getValue(input)} />;
    }

    const string = (input) => {
        return <Input type={input.type} name={input.name} errors={getError(input.name)} onInput={() => errorHide(input.name)} value={getValue(input)} max={input.max} />;
    }

    const datetime = (input) => {
        return <Input type={input.type} format={input.format} name={input.name} errors={getError(input.name)} onInput={() => errorHide(input.name)} value={getValue(input)} />;
    }

    const _constructor = (input) => {
        return <Constructor name={input.name} screen={input.screen} options={input.options} fields={input.fields} defaultFields={input.defaultFields} value={getValue(input)} />;
    }

    const array = (input) => {
        return <Fieldsets input={input} editItem={props.editItem} fields={props.fields} />;
    }

    const getValue = (input) => {
        let value = props.editItem[input.name];

        if (typeof value === 'undefined' && input.name) {
            value = getDataValue(input.name.replace('[]', ''), props.editItem);
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

    const getError = useCallback((name) => {
        if (props.errors && name) {
            name = name.replace('[]', '');

            return props.errors[name];
        }

        return null;
    }, []);

    const errorHide = useCallback((name) => {
        if (props.errorHide && name) {
            props.errorHide(name.replace('[]', ''));
        }
    }, []);

    const Component = (input) => {
        switch (input.type) {
            case 'switch':
                return switchElem(input)
                break;

            case 'select':
                return select(input)
                break;

            case 'file':
                return file(input)
                break;

            case 'text':
                return text(input)
                break;

            case 'texteditor':
                return texteditor(input)
                break;

            case 'hidden':
                return hidden(input)
                break;

            case 'datetime':
                return datetime(input)
                break;

            case '_constructor':
                return _constructor(input)
                break;

            case 'array':
                return array(input)
                break;

            default:
                return string(input)
                break;
        }
    }

    return props.inputs.map(input => {
        if (!input.readonly && input.name) {
            let label = null,
                description = null;

            if (input.type !== 'switch' && input.placeholder) {
                label = <label>{input.placeholder}</label>;
            }

            if (input.description) {
                description = <div className="description" dangerouslySetInnerHTML={{ __html: input.description }}></div>;
            }

            return (
                <div key={input.name} className={'form-group mb-3' + (input.max ? ' maxLength' : '')}>
                    {label}
                    {description}
                    {Component(input)}
                </div>
            )
        }
    });
}

export default FormFields;
