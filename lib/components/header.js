import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  click(e, page) {
    if (!page.href) {
      e.preventDefault();
      this.props.changePage(page, true);
    }
  }

  getMenuItems(url) {
    var result = [];
    this.props.pages.forEach(page => {
      if (url) {
        if (url != page.parent) {
          return false;
        }
      } else if (page.parent) {
        return false;
      }

      var childrens = this.getMenuItems(page.url);

      if (childrens.length) {
        result.push( /*#__PURE__*/React.createElement("div", {
          className: "links",
          key: page.url + '_group'
        }, this.getMenuItem(page, true), /*#__PURE__*/React.createElement("div", {
          className: "childrens shadow"
        }, childrens)));
      } else {
        result.push(this.getMenuItem(page));
      }
    });
    return result;
  }

  isChildrenActive(url) {
    var result = false;
    this.props.pages.forEach(page => {
      if (url == page.parent) {
        if (this.props.page.url == page.url) {
          result = true;
        }
      }
    });
    return result;
  }

  getMenuItem(page, isParent) {
    var active = this.props.page.url == page.url;

    if (isParent && !active) {
      active = this.isChildrenActive(page.url);
    }

    return /*#__PURE__*/React.createElement("a", {
      className: active ? 'active link' : 'link',
      href: page.href ? page.href : '/admin?url=' + page.url,
      key: page.url,
      onClick: e => this.click(e, page)
    }, page.name, isParent ? /*#__PURE__*/React.createElement("svg", {
      fill: "none",
      height: "8",
      viewBox: "0 0 12 8",
      width: "12",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      clipRule: "evenodd",
      d: "M2.16 2.3a.75.75 0 011.05-.14L6 4.3l2.8-2.15a.75.75 0 11.9 1.19l-3.24 2.5c-.27.2-.65.2-.92 0L2.3 3.35a.75.75 0 01-.13-1.05z",
      fill: "currentColor",
      clipRule: "evenodd"
    })) : '');
  }

  user_actions() {
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
    return /*#__PURE__*/React.createElement("header", {
      id: "header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "menu"
    }, this.getMenuItems()), /*#__PURE__*/React.createElement("div", {
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
    }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C") : '', this.user_actions())));
  }

}

export default Header;