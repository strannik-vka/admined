import React from "react";

class Actions extends React.Component {
  constructor(props) {
    super(props);
  }

  actions() {
    if (typeof this.props.page.actions !== 'undefined') {
      return this.props.page.actions.map((action, i) => /*#__PURE__*/React.createElement(React.Fragment, null, i ? null : /*#__PURE__*/React.createElement("div", {
        className: "divider"
      }, "|"), /*#__PURE__*/React.createElement("a", {
        className: "btn action-item",
        href: action.href ? action.href : null,
        onClick: action.onclick ? action.onclick : null,
        target: action.target ? action.target : null,
        key: i
      }, action.text)));
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "actions",
      style: this.props.page.form.length ? {
        display: 'flex'
      } : {
        display: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "to_total"
    }, "\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E: ", this.props.to, " \u0438\u0437 ", this.props.total, /*#__PURE__*/React.createElement("span", {
      className: "saveStatus"
    }, this.props.saveStatus)), /*#__PURE__*/React.createElement("div", null, this.props.page.config('deleteAction', true) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "selected"
    }, "\u0412\u044B\u0431\u0440\u0430\u043D\u043E: ", this.props.itemsSelected.length), /*#__PURE__*/React.createElement("a", {
      className: this.props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item",
      onClick: this.props.itemsDelete
    }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C")) : '', this.props.page.config('addAction', true) ? /*#__PURE__*/React.createElement("a", {
      className: "btn action-item",
      onClick: this.props.showForm
    }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C") : '', this.actions()));
  }

}

export default Actions;