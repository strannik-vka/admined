import React from "react";
import FormFields from "./formFields";
import { isObject } from "../../shared/lib/isObject";
import Input from "./input";

class CustomField extends React.Component {

    constructor(props) {
        super(props);
    }

    getUserField() {
        let input = null;

        for (let i = 0; i < this.props.fields.length; i++) {
            let element = this.props.fields[i];

            if (this.props.field.type == element.name) {
                let element_clone = Object.assign({}, element);

                if (Array.isArray(element_clone.fields)) {
                    element_clone.fields = element_clone.fields.map(item => {
                        let item_clone = Object.assign({}, item);

                        if (item_clone.name.indexOf(this.props.field.id) == -1) {
                            item_clone.name = this.props.field.name + '' + item_clone.name;
                        }

                        return item_clone;
                    });
                }

                input = element_clone;

                break;
            }
        }

        return input;
    }

    getFields(input) {
        let result = [];

        if (isObject(this.props.field.value)) {
            let keys = Object.keys(this.props.field.value),
                fieldsCount = this.props.field.value[keys[0]].length;

            for (let i = 0; i < fieldsCount; i++) {
                let fields = input.fields.map(field => {
                    let fieldClone = Object.assign({}, field),
                        key = null;

                    for (let key_i = 0; keys.length; key_i++) {
                        if (field.name.indexOf('[' + keys[key_i] + ']') > -1) {
                            key = keys[key_i];
                            break;
                        }
                    }

                    fieldClone.value = this.props.field.value[key][i];

                    return fieldClone;
                });

                result.push({
                    name: input.name,
                    type: input.type,
                    fields: fields
                });
            }
        }

        return result;
    }

    getEditItem() {
        let results = {}, parts = [];

        if (this.props.field.name.indexOf('[') > -1) {
            parts = this.props.field.name.split('[');

            parts = parts.map(item => {
                return item.replace(']', '');
            });
        } else {
            parts = [this.props.field.name];
        }

        parts = parts.reverse();

        parts.forEach((part, i) => {
            if (i) {
                results[part] = results;
            } else {
                results[part] = this.props.field.value;
            }
        });

        return results;
    }

    render() {
        let result = null, userField = null;

        if (Array.isArray(this.props.fields)) {
            userField = this.getUserField();
        }

        if (isObject(userField)) {
            if (userField.type == 'fields') {
                result = <FormFields
                    inputs={userField.fields}
                    fields={this.getFields(userField.fields[0])}
                    editItem={this.getEditItem()}
                />
            } else {
                result = <FormFields
                    inputs={[userField]}
                    fields={this.getFields(userField)}
                />
            }
        } else {
            result = <Input name={this.props.field.name} value={this.props.field.value} />
        }

        return result;
    }

}

export default CustomField;