import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  click(e, page) {
    if (!page.href) {
      e.preventDefault();
      this.props.changePage(page);
    }
  }

  links() {
    return this.props.pages.map(page => /*#__PURE__*/React.createElement("a", {
      className: this.props.page.url == page.url ? 'active link' : 'link',
      href: page.href ? page.href : '/admin?url=' + page.url,
      key: page.url,
      onClick: e => this.click(e, page)
    }, page.name));
  }

  render() {
    return /*#__PURE__*/React.createElement("header", {
      id: "header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menu"
    }, this.links()), /*#__PURE__*/React.createElement("div", {
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
    }, this.props.saveStatus)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "selected"
    }, "\u0412\u044B\u0431\u0440\u0430\u043D\u043E: ", this.props.itemsSelected.length), /*#__PURE__*/React.createElement("button", {
      className: this.props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item",
      onClick: this.props.itemsDelete
    }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"), /*#__PURE__*/React.createElement("button", {
      className: "btn action-item",
      onClick: this.props.showForm
    }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C"))));
  }

}

export default Header;