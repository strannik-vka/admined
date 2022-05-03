import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DivInput from "../components/divInput";
import Checkbox from "../components/checkbox";
import Select from "../components/select";

class Filter extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        var actions = [];

        if (this.props.page.config('deleteAction', true) && this.props.itemsToCount) {
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

    getInputHtml(input, key, value) {
        var result = null;

        if (input.type == 'select') {
            let options = [];

            if (Array.isArray(this.props.page.vars[key.replace('_id', '').replace('[]', '')])) {
                options = Array.from(this.props.page.vars[key.replace('_id', '').replace('[]', '')]);
            }

            result = <Select
                name={key.replace('[]', '')}
                options={options}
                placeholder={input.placeholder}
                value={value}
                onChange={(value) => this.props.onChange(value, key)}
                text_key={input.text_key}
                url={input.url}
            />;
        } else if (input.type == 'switch') {
            result = <Select
                name={key}
                options={[{ name: 'Да', value: 1 }, { name: 'Нет', value: 0 }]}
                placeholder={input.placeholder}
                value={value}
                onChange={(value) => this.props.onChange(value, key)}
            />;
        } else {
            result = <DivInput
                readonly={input.filter === 'readonly'}
                name={key}
                placeholder={input.placeholder}
                center={input.center}
                value={value}
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
                    this.props.page.form.map(input => {
                        var key = input.name;

                        if (typeof input.text_key !== 'undefined' && typeof input.with !== 'undefined') {
                            key = input.with + '_' + input.text_key;
                        }

                        return (
                            input.filter === false
                                ? false
                                : <th key={key} className="filter-item">{
                                    this.getInputHtml(input, key, this.props.page.filter[key])
                                }</th>
                        )
                    })
                }
            </>
        );
    }

}

export default Filter;