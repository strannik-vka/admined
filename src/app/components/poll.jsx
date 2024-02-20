import React from "react";
import Input from "./input";
import Fieldsets from "./fieldsets";
import Switch from "./switch";
import Label from "../../shared/ui/form/Label";

class Poll extends React.Component {

    constructor(props) {
        super(props);

        this.question =
            this.props.value && this.props.value.question
                ? this.props.value.question : null;

        let
            is_user_variant = this.props.value && this.props.value.is_user_variant
                ? parseInt(this.props.value.is_user_variant) : 0,
            is_multi = this.props.value && this.props.value.is_multi
                ? parseInt(this.props.value.is_multi) : 0;

        this.state = {
            is_user_variant: is_user_variant,
            is_multi: is_multi,
        }
    }

    getFieldsetsInput() {
        let data = {
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

        if (this.props.correctVariant) {
            data.switcher = {
                name: this.props.name + '[switched][]',
                label: 'Верный',
                isMulti: this.state.is_multi,
                value: this.props.value && this.props.value.switched ? this.props.value.switched : null
            }
        }

        return data;
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

    isMultiToggle = (checked) => {
        this.setState({
            is_multi: checked
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
        let switchGroup = this.props.multiVariant || this.props.userVariant;

        return <>
            <div className="form-group mb-2">
                <Label text="Вопрос" />
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
            <div className="poll-switch-group" style={switchGroup ? {} : { display: 'none' }}>
                {
                    this.props.multiVariant ? <Switch
                        checked={this.state.is_multi}
                        onChange={this.isMultiToggle}
                        name={this.props.name + '[is_multi]'}
                        placeholder="Выбор нескольких вариантов"
                        value="1"
                    /> : null
                }
                {
                    this.props.userVariant ? <Switch
                        checked={this.state.is_user_variant}
                        onChange={this.userVariantToggle}
                        name={this.props.name + '[is_user_variant]'}
                        placeholder="Свой вариант ответа"
                        value="1"
                    /> : null
                }
            </div>
        </>
    }

}

export default Poll;