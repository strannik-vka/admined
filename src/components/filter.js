import React from "react";
import DivInput from "./form/div_input";
import Checkbox from "./form/checkbox";
import Select from "./form/select";

class Filter extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        var isActions = this.props.page.config('deleteAction', true);

        if (isActions) {
            return (
                <th className="filter-item">
                    <Checkbox
                        checked={(this.props.itemsToCount == this.props.itemsSelectedCount) && this.props.itemsSelectedCount}
                        onChange={this.props.itemSelectAll}
                    />
                </th>
            )
        }
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
                            input.filter === false ? false :
                                <th key={key} className="filter-item">
                                    {input.type == 'select'
                                        ? <Select
                                            name={key}
                                            options={this.props.page.vars[key.replace('_id', '')]}
                                            placeholder={input.placeholder}
                                            value={this.props.page.filter[key]}
                                            onChange={(value) => this.props.onChange(value, key)}
                                            text_key={input.text_key}
                                        />
                                        : <DivInput
                                            readonly={input.filter === 'readonly'}
                                            name={key}
                                            placeholder={input.placeholder}
                                            center={input.center}
                                            value={this.props.page.filter[key]}
                                            onInput={(value, callback) => this.props.onChange(value, key, callback)}
                                        />
                                    }
                                </th>
                        )
                    })
                }
            </>
        );
    }

}

export default Filter;