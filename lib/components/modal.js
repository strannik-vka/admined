import React from "react";
export default (props => {
  let styles = null,
      scrollBarWidth = getScrollBarWidth();

  if (props.show) {
    styles = {
      display: 'block',
      paddingLeft: scrollBarWidth - 1 + 'px'
    };
    document.body.setAttribute('style', 'overflow: hidden;padding-right: ' + scrollBarWidth + 'px;');
    addClass(document.body, 'modal-open');
  } else {
    document.body.removeAttribute('style');
    removeClass(document.body, 'modal-open');
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, props.show ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fade modal-backdrop show"
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    className: "fade modal show",
    style: styles
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-xl modal-dialog-centered"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: props.onHide
  }), props.children))))) : '');
});