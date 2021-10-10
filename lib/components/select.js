import React from "react";

const axios = require('axios').default;

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options ? this.props.options : []
    };

    if (this.props.url) {
      this.getOptions();
    }
  }

  getOptions() {
    axios.get(this.props.url).then(response => {
      this.setState({
        options: response.data.data
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("select", {
      name: this.props.name,
      className: "form-control"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "- \u0412\u044B\u0431\u0440\u0430\u0442\u044C -"), this.state.options.map(option => {
      var value = option.id ? option.id : option.value ? option.value : '';
      return /*#__PURE__*/React.createElement("option", {
        key: option.name + '_' + value,
        value: value
      }, option.name);
    }));
  }

}

export default Select;