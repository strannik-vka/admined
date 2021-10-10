import React from "react";
import DivInput from "./form/div_input";
import Checkbox from "./form/checkbox";
import Select from "./form/select";

class Filter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("th", {
      className: "filter-item"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: this.props.itemsToCount == this.props.itemsSelectedCount && this.props.itemsSelectedCount,
      onChange: this.props.itemSelectAll
    })), this.props.page.form.map(input => input.filter === false ? false : /*#__PURE__*/React.createElement("th", {
      key: input.name,
      className: "filter-item"
    }, input.type == 'select' ? /*#__PURE__*/React.createElement(Select, {
      name: input.name,
      options: this.props.page.vars[input.name.replace('_id', '')]
    }) : /*#__PURE__*/React.createElement(DivInput, {
      readonly: input.filter === 'readonly',
      name: input.name,
      placeholder: input.placeholder,
      center: input.center
    }))));
  }

}

export default Filter;