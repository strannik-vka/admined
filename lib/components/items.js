import React from "react";
import DivInput from "./form/div_input";
import Checkbox from "./form/checkbox";
import Switch from "./form/switch";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from "./form/select";

class Items extends React.Component {
  constructor(props) {
    super(props);
  }

  switch(item, input) {
    return /*#__PURE__*/React.createElement(Switch, {
      name: input.name,
      checked: item[input.name],
      placeholder: input.placeholder,
      onChange: value => this.props.onItemChange(item.id, input.name, value),
      value: "1"
    });
  }

  select(item, input) {
    return /*#__PURE__*/React.createElement(Select, {
      name: input.name,
      value: item[input.name],
      options: this.props.page.vars[input.name.replace('_id', '')],
      onChange: value => this.props.onItemChange(item.id, input.name, value)
    });
  }

  file(item, input) {
    return isImage(item[input.name]) ? /*#__PURE__*/React.createElement("a", {
      href: item[input.name],
      target: "_blank"
    }, /*#__PURE__*/React.createElement("img", {
      src: imageUrl(item[input.name], input.thumb),
      className: "image"
    })) : item[input.name] ? /*#__PURE__*/React.createElement("a", {
      href: item[input.name],
      target: "_blank"
    }, "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0444\u0430\u0439\u043B") : '—';
  }

  string(item, input) {
    return /*#__PURE__*/React.createElement(DivInput, {
      type: "string",
      readonly: input.readonly,
      center: input.center,
      value: item[input.name],
      onChange: (value, callback) => this.props.onItemChange(item.id, input.name, value, callback)
    });
  }

  datetime(item, input) {
    return /*#__PURE__*/React.createElement(DivInput, {
      type: "string",
      readonly: input.readonly,
      center: input.center,
      value: dateFormat(item[input.name]),
      onChange: (value, callback) => this.props.onItemChange(item.id, input.name, value, callback)
    });
  }

  text(item, input) {
    return /*#__PURE__*/React.createElement(DivInput, {
      type: "text",
      readonly: input.readonly,
      center: input.center,
      value: item[input.name],
      onChange: (value, callback) => this.props.onItemChange(item.id, input.name, value, callback)
    });
  }

  render() {
    return this.props.paginate.data.map(item => /*#__PURE__*/React.createElement("tr", {
      key: item.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "actions"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: this.props.itemsSelected.indexOf(item.id) > -1,
      onChange: () => this.props.itemSelect(item.id)
    }), /*#__PURE__*/React.createElement(OverlayTrigger, {
      key: "top",
      placement: "top",
      overlay: /*#__PURE__*/React.createElement(Tooltip, {
        id: "tooltip-top"
      }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C")
    }, /*#__PURE__*/React.createElement("svg", {
      onClick: () => this.props.setItemEdit(item.id),
      className: "edit-icon",
      width: "31",
      height: "31",
      viewBox: "0 0 31 31",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("g", {
      clipPath: "url(#clip0)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M25.1875 13.0781V27.0039C25.1875 27.4015 25.1092 27.7951 24.9571 28.1624C24.8049 28.5297 24.5819 28.8634 24.3008 29.1446C24.0197 29.4257 23.686 29.6487 23.3187 29.8008C22.9514 29.9529 22.5577 30.0312 22.1602 30.0312H3.99609C3.19319 30.0313 2.42318 29.7123 1.85544 29.1446C1.2877 28.5768 0.96875 27.8068 0.96875 27.0039V8.83984C0.96875 8.03694 1.2877 7.26693 1.85544 6.69919C2.42318 6.13145 3.19319 5.8125 3.99609 5.8125H16.6716",
      stroke: "#212529",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M30.6927 0.397328C30.5821 0.275821 30.448 0.177997 30.2985 0.109766C30.1491 0.0415349 29.9873 0.00431447 29.823 0.000353327C29.6588 -0.00360782 29.4954 0.0257726 29.3428 0.0867194C29.1903 0.147666 29.0516 0.238914 28.9353 0.354948L27.9991 1.28654C27.8856 1.40006 27.8219 1.55399 27.8219 1.71449C27.8219 1.87499 27.8856 2.02892 27.9991 2.14244L28.8574 2.99911C28.9136 3.05563 28.9805 3.10047 29.0541 3.13108C29.1278 3.16168 29.2067 3.17743 29.2865 3.17743C29.3662 3.17743 29.4452 3.16168 29.5188 3.13108C29.5925 3.10047 29.6593 3.05563 29.7156 2.99911L30.6283 2.09098C31.09 1.63011 31.1331 0.879392 30.6927 0.397328ZM26.1063 3.17847L12.444 16.8155C12.3611 16.898 12.3009 17.0004 12.2692 17.1129L11.6372 18.995C11.6221 19.0461 11.621 19.1003 11.6341 19.1519C11.6472 19.2035 11.674 19.2507 11.7117 19.2883C11.7493 19.326 11.7965 19.3528 11.8481 19.3659C11.8997 19.379 11.9539 19.3779 12.005 19.3628L13.8857 18.7309C13.9982 18.6991 14.1007 18.6389 14.1832 18.5561L27.8213 4.89331C27.9474 4.7658 28.0182 4.59366 28.0182 4.41428C28.0182 4.23489 27.9474 4.06275 27.8213 3.93524L27.0682 3.17847C26.9405 3.05115 26.7676 2.97965 26.5872 2.97965C26.4069 2.97965 26.234 3.05115 26.1063 3.17847Z",
      fill: "#212529"
    })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: "clip0"
    }, /*#__PURE__*/React.createElement("rect", {
      width: "31",
      height: "31",
      fill: "white"
    }))))))), this.props.page.form.map(input => input.filter === false ? false : /*#__PURE__*/React.createElement("td", {
      key: item.id + '_' + input.name,
      className: input.center ? 'text-center' : ''
    }, this[input.type ? input.type : 'string'](item, input)))));
  }

}

export default Items;