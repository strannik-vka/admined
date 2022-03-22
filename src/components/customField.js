import React from "react";
import FormFields from "./formFields";

class CustomField extends React.Component {

    constructor(props) {
        super(props);
    }

    getFieldsetsInputs() {
        let inputs = [];

        this.props.fields.forEach(element => {
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

                inputs.push(element_clone);
            }
        });

        return inputs;
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
                        if (field.name.indexOf(keys[key_i]) > -1) {
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

    render() {
        let result = null;

        if (Array.isArray(this.props.fields)) {
            let inputs = this.getFieldsetsInputs();

            if (inputs.length) {
                result = <FormFields inputs={inputs} fields={this.getFields(inputs[0])} />
            }
        } else {
            result = <Input name={this.props.field.name} value={this.props.field.value} />
        }

        return result;
    }

}

export default CustomField;