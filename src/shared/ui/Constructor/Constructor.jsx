import React, { useEffect, useState } from "react";
import DefaultFields from "./DefaultFields";
import styles from "../../../app/scss/shared/ui/Constructor/Constructor.module.scss";
import PlusButtonPopover from "./PlusButtonPopover";
import FieldGroup from "../FieldGroup";

/*  props:
    - name: string - name для полей
    - screens: object - {h1: 'ссылка на картинку'} - скрины полей
    - options: object - {poll: {}} - опции для полей
    - customFields: [] - массив кастомных полей
    - defaultFields: [] - массив ключей стандартных полей
    - value: - значения полей
*/

let NEW_FIELD_NAME = null;

const Constructor = (props) => {
    // PopoverFields
    let PopoverFields = DefaultFields;

    if (Array.isArray(props.defaultFields)) {
        PopoverFields = DefaultFields.filter(item => props.defaultFields.indexOf(item.type) > -1)
    }

    if (Array.isArray(props.customFields)) {
        const customFields = props.customFields.map(item => {
            return {
                ...item,
                ...{
                    type: item.name,
                    label: item.placeholder,
                }
            }
        })

        PopoverFields = [...PopoverFields, ...customFields];
    }

    // valueFields
    let valueFields = [];

    const texteditorField = PopoverFields.filter(item => item.type === 'texteditor');

    if (Array.isArray(props.value)) {
        props.value.forEach(item => {
            let name = Object.keys(item)[0],
                nameArr = name.split('_');

            const typeField = PopoverFields.filter(item => item.type === nameArr[0]);

            if (typeField.length == 1) {
                valueFields.push({
                    id: parseInt(nameArr[1]),
                    type: nameArr[0],
                    value: item[name],
                    name: props.name + '[' + name + ']',
                    label: typeField[0].label,
                    description: typeField[0].description,
                });
            }
        })
    } else if (typeof props.value === 'string') {
        valueFields.push({
            id: 1,
            type: 'texteditor',
            value: props.value,
            name: props.name + '[texteditor_1]',
            label: texteditorField[0].label,
            description: texteditorField[0].description,
        });
    }

    if (valueFields.length == 0) {
        valueFields.push({
            ...{
                id: 1,
                name: props.name + '[texteditor_1]',
            },
            ...texteditorField[0]
        });
    }

    // useState
    const [selectedFields, setSelectedFields] = useState(valueFields);

    const storeFieldId = () => {
        let id = 0;

        selectedFields.forEach(item => {
            if (item.id > id) {
                id = item.id;
            }
        })

        return id + 1;
    }

    const fieldFocus = () => {
        if (NEW_FIELD_NAME) {
            let input = document.querySelector('[name="' + NEW_FIELD_NAME + '"]');

            if (!input) {
                input = document.querySelector('[data-name="' + NEW_FIELD_NAME + '"]');
            }

            NEW_FIELD_NAME = null;

            if (input) {
                setTimeout(() => {
                    input.click();
                    input.focus();
                }, 400)
            }
        }
    }

    const fieldAdd = (field, id) => {
        document.body.click();

        setSelectedFields(prevState => {
            let fieldId = storeFieldId();

            NEW_FIELD_NAME = props.name + '[' + field.type + '_' + fieldId + ']';

            let item = {
                ...field,
                ...{
                    name: NEW_FIELD_NAME,
                    id: fieldId
                }
            }

            if (typeof id === 'number') {
                let indexPaste = null;

                prevState.forEach((element, index) => {
                    if (element.id === id) {
                        indexPaste = index;
                    }
                });

                prevState.splice(indexPaste, 0, item);
            } else {
                prevState.push(item);
            }

            return [
                ...prevState
            ]
        })
    }

    const fieldDel = (id) => {
        let inputs = document.querySelectorAll('[name*="' + id + '"]'),
            isValue = null;

        if (inputs.length) {
            inputs.forEach(input => {
                if (input.value && input.value != '<p><br></p>') {
                    isValue = true;
                }
            });
        }

        if (isValue) {
            if (!confirm('Подтверждаете удаление?')) {
                return false;
            }
        }

        setSelectedFields(prevState => {
            return [
                ...prevState.filter((field) => id !== field.id)
            ]
        });
    }

    const fieldDrag = (id, up) => {
        setSelectedFields(prevState => {
            let indexPaste = null,
                fieldPaste = null;

            prevState.forEach((field, index) => {
                if (field.id === id) {
                    indexPaste = index;
                    fieldPaste = field;
                }
            });

            prevState.splice(up ? indexPaste - 1 : indexPaste + 2, 0, fieldPaste);
            prevState.splice(up ? indexPaste + 1 : indexPaste, 1);

            return [
                ...prevState
            ]
        });
    }

    // const
    let selectedFieldsIds = selectedFields.map(field => {
        return field.id;
    });

    // useEffects
    useEffect(() => {
        fieldFocus();
    }, [selectedFields])

    return (
        <div className={styles.constructor}>
            {
                selectedFields.map((field, index) => {
                    let isPenult = (selectedFields.length - 1) === index,
                        isFirst = index === 0;

                    return (
                        <div key={field.id} className={styles['field-group-parent']}>
                            <div className={styles['svg-icons']}>
                                {isFirst == false &&
                                    <div onClick={() => fieldDrag(field.id, true)} className='svg-icon'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8.53033 1.36967C8.23744 1.07678 7.76256 1.07678 7.46967 1.36967L2.6967 6.14264C2.40381 6.43554 2.40381 6.91041 2.6967 7.2033C2.98959 7.4962 3.46447 7.4962 3.75736 7.2033L8 2.96066L12.2426 7.2033C12.5355 7.4962 13.0104 7.4962 13.3033 7.2033C13.5962 6.91041 13.5962 6.43554 13.3033 6.14264L8.53033 1.36967ZM8.75 14.9V1.9H7.25L7.25 14.9H8.75Z" /></svg>
                                    </div>
                                }
                                {isPenult == false &&
                                    <div onClick={() => fieldDrag(field.id)} className='svg-icon'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.46967 14.6303C7.76256 14.9232 8.23744 14.9232 8.53033 14.6303L13.3033 9.85736C13.5962 9.56447 13.5962 9.08959 13.3033 8.7967C13.0104 8.5038 12.5355 8.5038 12.2426 8.7967L8 13.0393L3.75736 8.7967C3.46447 8.5038 2.98959 8.5038 2.6967 8.7967C2.40381 9.08959 2.40381 9.56446 2.6967 9.85736L7.46967 14.6303ZM7.25 1.1L7.25 14.1L8.75 14.1L8.75 1.1L7.25 1.1Z" /></svg>
                                    </div>
                                }
                                <PlusButtonPopover
                                    placement="left"
                                    fields={PopoverFields}
                                    onItemClick={(clickfield) => fieldAdd(clickfield, field.id)}
                                />
                                <div onClick={() => fieldDel(field.id)} className='svg-icon'>
                                    <svg viewBox="0 0 14 14"><path d="M13.5000308,3.23952 C13.5000308,4.55848168 11.9230308,12.0493 11.9230308,12.0782 C11.9230308,12.6571 9.73825083,14 7.04165083,14 C4.34504083,14 2.16025083,12.6571 2.16025083,12.0782 C2.16025083,12.0541 0.5,4.55799105 0.5,3.23952 C0.5,1.91780104 3.02713083,0 7.03525083,0 C11.0433308,0 13.5000308,1.9178004 13.5000308,3.23952 Z M7,2 C3.625,2 2.5,3.25 2.5,4 C2.5,4.75 3.625,6 7,6 C10.375,6 11.5,4.75 11.5,4 C11.5,3.25 10.375,2 7,2 Z"></path></svg>
                                </div>
                            </div>
                            <FieldGroup
                                {...field}
                                customFieldsAll={props.customFields}
                            />
                        </div>
                    )
                })
            }

            <PlusButtonPopover
                label="Добавить контент"
                fields={PopoverFields}
                onItemClick={fieldAdd}
            />

            <input type="hidden" name={props.name + '_sort'} value={selectedFieldsIds.join(',')} />

            {selectedFields.length == 0 &&
                <input type="hidden" name={props.name} value="" />
            }
        </div>
    )
}

export default Constructor;