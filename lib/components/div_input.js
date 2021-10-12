import React from "react";

class DivInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onPaste(e, type) {
    e.preventDefault();
    var text = e.clipboardData.getData('text/plain');

    if (type == 'string') {
      text = text.replace(new RegExp("\\r?\\n", "g"), " ");
    }

    window.document.execCommand('insertText', false, text);
  }

  onInput(e) {
    var text = e.target.innerHTML;

    if (text == '<div><br></div>' || text == '<br>' || text == '<br><br>') {
      e.target.innerHTML = '';
    }
  }

  onKeyPress(e, type) {
    if (type == 'string') {
      if (e.key == 'Enter' || e.shiftKey) {
        e.preventDefault();
      }
    }
  }

  render() {
    const type = this.props.type ? this.props.type : 'string';
    return /*#__PURE__*/React.createElement("div", {
      name: this.props.name,
      placeholder: this.props.placeholder,
      contentEditable: !this.props.readonly,
      suppressContentEditableWarning: true,
      type: type,
      className: this.props.center === true ? 'form-control text-center' : 'form-control',
      onPaste: e => this.onPaste(e, type),
      onInput: this.onInput,
      onKeyPress: e => this.onKeyPress(e, type)
    }, this.props.value);
  }

}

export default DivInput;