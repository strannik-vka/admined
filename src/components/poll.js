import React from "react";
import Input from "./input";
import Fieldsets from "./fieldsets";
import Switch from "./switch";

class Poll extends React.Component {

    constructor(props) {
        super(props);

        this.question = this.props.value && this.props.value.question ? this.props.value.question : null;

        let is_user_variant = this.props.value && this.props.value.is_user_variant ? parseInt(this.props.value.is_user_variant) : 0,
            is_multi = this.props.value && this.props.value.is_multi ? parseInt(this.props.value.is_multi) : 0;

        this.state = {
            is_user_variant: is_user_variant,
            is_multi: is_multi,
        }
    }

    getFieldsetsInput() {
        return {
            name: this.props.name + '[variant][]',
            placeholder: 'Вариант ответа',
            type: 'array',
            fields: [
                {
                    name: this.props.name + '[variant][]',
                    type: 'string'
                },
                {
                    name: this.props.name + '[count][]',
                    type: 'hidden'
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

    userVariantToggle = (checked) => {
        this.setState({
            is_user_variant: checked
        })
    }

    getUserField(checked) {
        if (checked) {
            return <fieldset className="mt-2">
                <legend>Свой ответ</legend>
                <input
                    readOnly={true}
                    type="text"
                    className="form-control readonly"
                    placeholder="Поле ввода своего ответа"
                />
            </fieldset>
        }

        return null;
    }

    render() {
        return <>
            <div className="form-group mb-2">
                <label>Вопрос</label>
                <Input
                    name={this.props.name + '[question]'}
                    value={this.question}
                />
            </div>
            <Fieldsets
                mb="mb-2"
                className="poll-group"
                input={this.getFieldsetsInput()}
                fields={this.getFields()}
            />
            {this.getUserField(this.state.is_user_variant)}
            <div className="poll-switch-group">
                <Switch
                    checked={this.state.is_multi}
                    name={this.props.name + '[is_multi]'}
                    placeholder="Выбор нескольких вариантов"
                    value="1"
                />
                <Switch
                    checked={this.state.is_user_variant}
                    onChange={this.userVariantToggle}
                    name={this.props.name + '[is_user_variant]'}
                    placeholder="Свой вариант ответа"
                    value="1"
                />
            </div>
        </>
    }

}

export default Poll;