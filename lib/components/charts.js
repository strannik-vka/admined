import React from "react";
import { Line } from 'react-chartjs-2';

class Charts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (typeof this.props.page.vars.charts !== 'undefined') {
      return /*#__PURE__*/React.createElement("div", {
        className: "charts"
      }, this.props.page.vars.charts.map((data, i) => {
        var options = {
          resposive: true
        };
        return /*#__PURE__*/React.createElement("div", {
          className: "chart_block",
          key: i
        }, /*#__PURE__*/React.createElement("div", {
          className: "title"
        }, data.title), /*#__PURE__*/React.createElement("div", {
          className: "description",
          style: data.description ? {
            display: 'block'
          } : {
            display: 'none'
          }
        }, data.description), /*#__PURE__*/React.createElement(Line, {
          className: "chart",
          data: data.config.data,
          options: options
        }));
      }));
    } else {
      return null;
    }
  }

}

export default Charts;