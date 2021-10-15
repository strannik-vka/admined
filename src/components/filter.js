import React from "react";
import DivInput from "./form/div_input";
import Checkbox from "./form/checkbox";
import Select from "./form/select";

class Filter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <th className="filter-item">
                    <Checkbox
                        checked={(this.props.itemsToCount == this.props.itemsSelectedCount) && this.props.itemsSelectedCount}
                        onChange={this.props.itemSelectAll}
                    />
                </th>
                {
                    this.props.page.form.map((input) =>
                        input.filter === false ? false :
                            <th key={input.name} className="filter-item">
                                {input.type == 'select'
                                    ? <Select
                                        name={input.name}
                                        options={this.props.page.vars[input.name.replace('_id', '')]}
                                        placeholder={input.placeholder}
                                        value={this.props.page.filter[input.name]}
                                        onChange={(value) => this.props.onChange(value, input.name)}
                                    />
                                    : <DivInput
                                        readonly={input.filter === 'readonly'}
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        center={input.center}
                                        value={this.props.page.filter[input.name]}
                                        onInput={(value, callback) => this.props.onChange(value, input.name, callback)}
                                    />
                                }
                            </th>
                    )
                }
            </>
        );
    }

}

export default Filter;