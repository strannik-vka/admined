import React from "react";
import DivInput from "./form/div_input";
import Checkbox from "./form/checkbox";
import Select from "./form/select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class Filter extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        var actions = [];

        if (this.props.page.config('deleteAction', true)) {
            actions.push(
                <Checkbox
                    key="deleteAction"
                    checked={(this.props.itemsToCount == this.props.itemsSelectedCount) && this.props.itemsSelectedCount}
                    onChange={this.props.itemSelectAll}
                />
            );
        }

        if (this.props.page.config('editAction', true)) {
            actions.push('');
        }

        if (actions.length) {
            return (
                <th className="filter-item">{actions}</th>
            )
        }
    }

    getInputHtml(input, key) {
        var result = null;

        if (input.type == 'select') {
            result = <Select
                name={key}
                options={this.props.page.vars[key.replace('_id', '')]}
                placeholder={input.placeholder}
                value={this.props.page.filter[key]}
                onChange={(value) => this.props.onChange(value, key)}
                text_key={input.text_key}
            />;
        } else if (input.type == 'switch') {
            result = <Select
                name={key}
                options={[{ name: 'Да', value: 1 }, { name: 'Нет', value: 0 }]}
                placeholder={input.placeholder}
                value={this.props.page.filter[key]}
                onChange={(value) => this.props.onChange(value, key)}
            />;
        } else {
            result = <DivInput
                readnly={input.filter === 'readonly'}
                name={key}
                placeholder={input.placeholder}
                center={input.center}
                value={this.props.page.filter[key]}
                onInput={(value, callback) => this.props.onChange(value, key, callback)}
            />;
        }

        if (typeof input.description !== 'undefined') {
            result = <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                    <Tooltip>{input.description}</Tooltip>
                }
            ><div>{result}</div></OverlayTrigger>
        }

        return result;
    }

    render() {
        return (
            <>
                {this.actions()}
                {
                    this.props.page.form.map((input) => {
                        var key = input.name;

                        if (typeof input.text_key !== 'undefined' && typeof input.with !== 'undefined') {
                            key = input.with + '_' + input.text_key;
                        }

                        return (
                            input.filter === false
                                ? false
                                : <th key={key} className="filter-item">{this.getInputHtml(input, key)}</th>
                        )
                    })
                }
            </>
        );
    }

}

export default Filter;