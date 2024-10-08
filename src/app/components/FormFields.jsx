import React, { useCallback, useState } from "react";
import Input from "./input";
import Select from "./select";
import SwitchComp from "./switch";
import File from "./File";
import TextEditor from "./texteditor";
import Textarea from "./textarea";
import Fieldsets from "./fieldsets";
import Constructor from "../../shared/ui/Constructor/Constructor";
import Label from "../../shared/ui/form/Label";
import Description from "../../shared/ui/form/Description";
import { getDataValue } from "../../shared/lib/GetDataValue";
import { nowDateTime } from "../../shared/lib/NowDateTime";
import { UrlMetaDataApi } from "../../entities/UrlMetaData";
import SelectCreateButton from "../../features/form/ui/SelectCreateButton";
import SaveValueButton from "../../features/form/ui/SaveValueButton";
import styles from '../scss/forms/FormFields.module.scss';
import { hasStorage, storage } from "../../shared/lib/Storage";
import { URLParam } from "../../shared/lib/URLParam";

const FormFields = (props) => {
    const [metaData, setMetaData] = useState({});

    const errorHide = useCallback((name) => {
        if (props.errorHide && name) {
            props.errorHide(name.replace('[]', ''));
        }
    }, []);

    const onInputHandler = useCallback((event) => {
        errorHide(event.target.name);

        const inputKey = URLParam('url') + '_' + event.target.name;

        if (hasStorage(inputKey)) {
            storage(inputKey, event.target.value);
        }

        if (event?.selectedOption) {
            storage(inputKey + '_option', event.selectedOption);
        }
    }, []);

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

    const select = (input, errors) => {
        let options = [],
            nameWith = input.name.replace('_id', '');

        if (Array.isArray(props.page.vars[input.name.replace('_id', '').replace('[]', '')])) {
            options = Array.from(props.page.vars[input.name.replace('_id', '').replace('[]', '')]);
        }

        if (props.editItem[nameWith]) {
            let option = props.editItem[nameWith];

            if (JSON.stringify(options).indexOf('"id":' + option.id + ',') === -1) {
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
                errors={errors}
                onChange={(value, selectedOption) => onInputHandler({
                    target: {
                        value: value,
                        name: input.name
                    },
                    selectedOption: selectedOption
                })}
                optionDescription={input.optionDescription}
            />
        )
    }

    const file = (input, errors) => {
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
                errors={errors}
                onInput={onInputHandler}
                value={getValue(input)}
                deleteRequest={input.deleteRequest} />
        )
    }

    const text = (input, errors) => {
        return (
            <Textarea
                name={input.name}
                errors={errors}
                onInput={onInputHandler}
                value={getValue(input)}
                max={input.max}
                showLength={input.showLength} />
        )
    }

    const texteditor = (input, errors) => {
        return <TextEditor
            name={input.name}
            errors={errors}
            onInput={onInputHandler}
            value={getValue(input)}
        />;
    }

    const hidden = (input) => {
        return <Input type={input.type} name={input.name} value={getValue(input)} />;
    }

    const string = (input, errors) => {
        let timeout = false;

        const onInput = useCallback((event) => {
            onInputHandler(event);

            if (input.isMetaDataUrl) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                    UrlMetaDataApi.fetchMetaData(event.target.value, data => {
                        setMetaData(data)
                    })
                }, 1000)
            }
        }, [])

        return (
            <Input
                type={input.type}
                name={input.name}
                errors={errors}
                onInput={onInput}
                value={getValue(input)}
                max={input.max}
            />
        )
    }

    const datetime = (input, errors) => {
        return <Input
            type={input.type}
            format={input.format}
            name={input.name}
            errors={errors}
            onInput={onInputHandler}
            value={getValue(input)}
        />;
    }

    const _constructor = (input) => {
        return <Constructor
            name={input.name}
            screens={input.screen}
            options={input.options}
            customFields={input.fields || input.customFields}
            defaultFields={input.defaultFields}
            value={getValue(input)}
        />
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

        if (input.metaDataKey) {
            if (metaData[input.metaDataKey]) {
                value = metaData[input.metaDataKey];
            }
        }

        if (!value) {
            const inputKey = URLParam('url') + '_' + input.name;

            if (hasStorage(inputKey)) {
                value = storage(inputKey);
            }
        }

        return value;
    }

    const Component = (input, errorMessage) => {
        switch (input.type) {
            case 'switch':
                return switchElem(input, errorMessage)
                break;

            case 'select':
                return select(input, errorMessage)
                break;

            case 'file':
                return file(input, errorMessage)
                break;

            case 'text':
                return text(input, errorMessage)
                break;

            case 'texteditor':
                return texteditor(input, errorMessage)
                break;

            case 'hidden':
                return hidden(input, errorMessage)
                break;

            case 'datetime':
                return datetime(input, errorMessage)
                break;

            case '_constructor':
                return _constructor(input, errorMessage)
                break;

            case 'array':
                return array(input, errorMessage)
                break;

            default:
                return string(input, errorMessage)
                break;
        }
    }

    return props.inputs.map((input, i) => {
        if (!input.readonly && input.name) {
            input = Object.create(input);

            let errorMessage = null;

            if (props.errors && input.name) {
                let name = input.name.replace('[]', '');

                errorMessage = props.errors[name];
            }

            let metaDataValue = null;

            if (input.metaDataKey) {
                if (metaData[input.metaDataKey]) {
                    metaDataValue = metaData[input.metaDataKey];
                }
            }

            if (props.isCreateForm && input.createMultiple) {
                input.name += '[]';
                input.multiple = true;
            }

            if (typeof input.SaveValueButton === 'undefined') {
                input.SaveValueButton = ['switch', 'select', 'text', 'datetime', 'string'].indexOf(input.type) > -1 || !input.type
            }

            return (
                <div key={input.name + '_' + metaDataValue} className={'form-group mb-3' + (input.max ? ' maxLength' : '')}>
                    <div className={styles.labelWrap}>
                        <Label text={input.placeholder} />
                        <div className={styles.labelRight}>
                            {input?.createButton &&
                                <SelectCreateButton
                                    inputName={input.name}
                                    options={input.createButton}
                                />
                            }
                            {input?.SaveValueButton &&
                                <SaveValueButton
                                    inputName={input.name}
                                />
                            }
                        </div>
                    </div>
                    <Description text={input.description} />
                    {Component(input, errorMessage, metaDataValue)}
                </div>
            )
        }
    });
}

export default FormFields;
