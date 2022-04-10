import React from "react";
import Actions from "./actions";
import Menu from "./menu";
export default (props => {
  return /*#__PURE__*/React.createElement("header", {
    id: "header"
  }, /*#__PURE__*/React.createElement(Menu, {
    isDomRender: props.isDomRender,
    pages: props.pages,
    page: props.page,
    changePage: props.changePage
  }), /*#__PURE__*/React.createElement(Actions, {
    page: props.page,
    to: props.to,
    total: props.total,
    saveStatus: props.saveStatus,
    itemsSelected: props.itemsSelected,
    itemsDelete: props.itemsDelete,
    showForm: () => props.showForm(true)
  }));
});