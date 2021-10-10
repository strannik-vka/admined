import React from "react";

class DivInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      name: this.props.name,
      placeholder: this.props.placeholder,
      contentEditable: !this.props.readonly,
      suppressContentEditableWarning: true,
      type: this.props.type ? this.props.type : 'string',
      className: this.props.center === true ? 'form-control text-center' : 'form-control'
    }, props.value);
  }

}

export default DivInput;