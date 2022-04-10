import React, { useState } from "react";
let otherItemsUrls = null;
export default (props => {
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);

  const otherMenuOpenClick = () => {
    setOtherMenuOpen(!otherMenuOpen);
  };

  const menuItemClick = (e, page) => {
    if (!page.href) {
      e.preventDefault();
      props.changePage(page, true);
    }
  };

  const isChildrenActive = url => {
    var result = false;
    props.pages.forEach(page => {
      if (url == page.parent) {
        if (props.page.url == page.url) {
          result = true;
        }
      }
    });
    return result;
  };

  const getMenuItem = ({
    page,
    isChildrens,
    getOthers
  }) => {
    let active = props.page.url == page.url;

    if (isChildrens && !active) {
      active = isChildrenActive(page.url);
    }

    return /*#__PURE__*/React.createElement("a", {
      className: active ? 'active link' : 'link',
      href: page.href ? page.href : '/admin?url=' + page.url,
      key: page.url,
      onClick: e => menuItemClick(e, page)
    }, page.name, isChildrens ? /*#__PURE__*/React.createElement("svg", {
      fill: "none",
      height: "8",
      viewBox: "0 0 12 8",
      width: "12",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      clipRule: "evenodd",
      d: "M2.16 2.3a.75.75 0 011.05-.14L6 4.3l2.8-2.15a.75.75 0 11.9 1.19l-3.24 2.5c-.27.2-.65.2-.92 0L2.3 3.35a.75.75 0 01-.13-1.05z",
      fill: "currentColor"
    })) : '');
  };

  const getOtherItemsUrls = () => {
    let result = [],
        headerWidth = document.querySelector('#header').scrollWidth - 200,
        menuItems = document.querySelector('.menu').childNodes,
        menuWidth = 0;
    menuItems.forEach(element => {
      menuWidth += element.scrollWidth;

      if (menuWidth > headerWidth) {
        result.push(element.getAttribute('href'));
      }
    });
    return result.join(',');
  };

  const getItemChildrens = url => {
    let result = [];
    props.pages.forEach(page => {
      if (url == page.parent) {
        result.push(getMenuItem({
          page: page
        }));
      }
    });
    return result;
  };

  const getMenuItems = ({
    otherItemsUrls,
    getOthers
  }) => {
    let result = [];
    props.pages.forEach(page => {
      if (!page.parent) {
        let itemAccess = getOthers && otherItemsUrls.indexOf(page.url) > -1 || getOthers == false && otherItemsUrls.indexOf(page.url) == -1;

        if (itemAccess) {
          let childrens = getItemChildrens(page.url);

          if (childrens.length) {
            childrens.unshift(getMenuItem({
              page: page
            }));
            result.push( /*#__PURE__*/React.createElement("div", {
              className: "links",
              key: page.url + '_group'
            }, getMenuItem({
              page: page,
              isChildrens: true,
              getOthers: getOthers
            }), /*#__PURE__*/React.createElement("div", {
              className: "childrens shadow"
            }, childrens)));
          } else {
            result.push(getMenuItem({
              page: page,
              getOthers: getOthers
            }));
          }
        }
      }
    });
    return result;
  };

  if (props.isDomRender && otherItemsUrls === null) {
    otherItemsUrls = getOtherItemsUrls();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "menu"
  }, getMenuItems({
    otherItemsUrls: otherItemsUrls == null ? '' : otherItemsUrls,
    getOthers: false
  }), otherItemsUrls ? /*#__PURE__*/React.createElement("div", {
    className: 'otherMenu' + (otherMenuOpen ? ' open' : ''),
    onClick: otherMenuOpenClick
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "otherMenuItems shadow"
  }, getMenuItems({
    otherItemsUrls: otherItemsUrls == null ? '' : otherItemsUrls,
    getOthers: true
  }))) : '');
});