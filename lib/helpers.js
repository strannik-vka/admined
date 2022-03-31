window.getCursorPosition = parent => {
  let selection = document.getSelection();
  let range = new Range();
  range.setStart(parent, 0);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().length;
};

window.setCursorPosition = (parent, position) => {
  let child = parent.firstChild;

  while (position > 0) {
    let length = child.textContent.length;

    if (position > length) {
      position -= length;
      child = child.nextSibling;
    } else {
      if (child.nodeType == 3) {
        return document.getSelection().collapse(child, position);
      }

      child = child.firstChild;
    }
  }
};

window.dateFormat = value => {
  if (value) {
    var date = new Date(value);

    if (date != 'Invalid Date') {
      var month = date.getMonth() + 1,
          day = date.getDate();
      value = '';
      value += date.getFullYear() + '-';
      value += (month < 10 ? '0' + month : month) + '-';
      value += (day < 10 ? '0' + day : day) + ' ';
      value += date.toLocaleTimeString().slice(0, -3);
    }
  }

  return value;
};

window.isImage = url => {
  if (url) {
    var ext = url.split('.'),
        ext = ext[ext.length - 1],
        ext = ext.toLowerCase(),
        ext = ext.split('?'),
        ext = ext[0],
        images = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    return images.indexOf(ext) > -1;
  }

  return false;
};

window.URLParam = name => {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

  if (results == null) {
    return null;
  }

  return decodeURI(results[1]) || 0;
};

window.imageUrl = (url, thumb) => {
  if (thumb && url) {
    var name = url.split('/'),
        name = name[name.length - 1];
  }

  return url ? thumb ? url.replace(name, thumb + '_' + name) : url : '';
};

window.isObject = function (val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

window.getDataValue = function (str, data) {
  if (typeof data[str] !== 'undefined') {
    return data[str];
  }

  if (typeof data[str + '[]'] !== 'undefined') {
    return data[str + '[]'];
  }

  let parts = [];

  if (str.indexOf('.') > -1) {
    parts = str.split('.');
  } else if (str.indexOf('[') > -1) {
    parts = str.split('[');
    parts = parts.map(item => {
      return item.replace(']', '');
    });
  } else {
    parts.push(str);
  }

  if (parts.length) {
    for (let i = 0; i < parts.length; i++) {
      data = data[parts[i]];

      if (!data) {
        break;
      }
    }

    return data === undefined ? null : data;
  }

  return null;
};

window.template = (str, data) => {
  var result = str;

  if (str) {
    var codes = str.match(/\{([^\}]*)\}/g);
    codes.forEach(element => {
      var key = element.replace('{', '').replace('}', ''),
          value = getDataValue(key, data);
      var regex = new RegExp(element, "g");
      result = result.replace(regex, value);
    });
  }

  return result;
};

window.nowDateTime = () => {
  var date = new Date(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      datetime = '';
  datetime += date.getFullYear() + '-';
  datetime += (month < 10 ? '0' + month : month) + '-';
  datetime += (day < 10 ? '0' + day : day) + ' ';
  datetime += date.toLocaleTimeString().slice(0, -3);
  return datetime;
};

window.getScrollBarWidth = () => {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";
  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
};

window.hasClass = (ele, cls) => {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

window.addClass = (ele, cls) => {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
};

window.removeClass = (ele, cls) => {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
};