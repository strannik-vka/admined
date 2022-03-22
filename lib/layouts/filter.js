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
      actions.push( /*#__PURE__*/React.createElement(Checkbox, {
        key: "deleteAction",
        checked: this.props.itemsToCount == this.props.itemsSelectedCount && this.props.itemsSelectedCount,
        onChange: this.props.itemSelectAll
      }));
    }

    if (this.props.page.config('editAction', true)) {
      actions.push('');
    }

    if (actions.length) {
      return /*#__PURE__*/React.createElement("th", {
        className: "filter-item"
      }, actions);
    }
  }

  getInputHtml(input, key) {
    var result = null;

    if (input.type == 'select') {
      result = /*#__PURE__*/React.createElement(Select, {
        name: key.replace('[]', ''),
        options: this.props.page.vars[key.replace('_id', '').replace('[]', '')],
        placeholder: input.placeholder,
        value: this.props.page.filter[key],
        onChange: value => this.props.onChange(value, key),
        text_key: input.text_key
      });
    } else if (input.type == 'switch') {
      result = /*#__PURE__*/React.createElement(Select, {
        name: key,
        options: [{
          name: 'Да',
          value: 1
        }, {
          name: 'Нет',
          value: 0
        }],
        placeholder: input.placeholder,
        value: this.props.page.filter[key],
        onChange: value => this.props.onChange(value, key)
      });
    } else {
      result = /*#__PURE__*/React.createElement(DivInput, {
        readonly: input.filter === 'readonly',
        name: key,
        placeholder: input.placeholder,
        center: input.center,
        value: this.props.page.filter[key],
        onInput: (value, callback) => this.props.onChange(value, key, callback)
      });
    }

    if (typeof input.description !== 'undefined') {
      result = /*#__PURE__*/React.createElement(OverlayTrigger, {
        key: "top",
        placement: "top",
        overlay: /*#__PURE__*/React.createElement(Tooltip, null, input.description)
      }, /*#__PURE__*/React.createElement("div", null, result));
    }

    return result;
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, this.actions(), this.props.page.form.map(input => {
      var key = input.name;

      if (typeof input.text_key !== 'undefined' && typeof input.with !== 'undefined') {
        key = input.with + '_' + input.text_key;
      }

      return input.filter === false ? false : /*#__PURE__*/React.createElement("th", {
        key: key,
        className: "filter-item"
      }, this.getInputHtml(input, key));
    }));
  }

}

export default Filter;