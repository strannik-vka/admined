import React from "react";
import Input from "./input";
import Fieldsets from "./fieldsets";

class Poll extends React.Component {

    constructor(props) {
        super(props);

        this.question = this.props.value && this.props.value.question ? this.props.value.question : null
    }

    getFieldsetsInput() {
        return {
            name: this.props.name + '[variant][]',
            placeholder: 'Вариант ответа',
            type: 'array',
            fields: [
                {
                    name: this.props.name + '[variant][]',
                    type: 'string',
                    placeholder: 'Текст ответа'
                },
                {
                    name: this.props.name + '[count][]',
                    type: 'string',
                    placeholder: 'Количество голосов'
                }
            ]
        }
    }

    getFields() {
        let result = [];

        if (this.props.value && this.props.value.variant) {
            this.props.value.variant.forEach((variant, i) => {
                result.push({
                    name: this.props.name + '[variant][]',
                    variant: variant,
                    count: this.props.value.count[i]
                });
            });
        }

        return result;
    }

    render() {
        return (
            <>
                <div className="form-group mb-3">
                    <label>Вопрос</label>
                    <Input
                        name={this.props.name + '[question]'}
                        value={this.question}
                    />
                </div>
                <Fieldsets
                    input={this.getFieldsetsInput()}
                    fields={this.getFields()}
                />
            </>
        );
    }

}

export default Poll;