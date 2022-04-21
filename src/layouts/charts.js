import isObject from "isobject";
import React from "react";
import { Line } from 'react-chartjs-2';

class Charts extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (typeof this.props.page.vars.charts !== 'undefined') {
            return <div className="charts">
                {this.props.page.vars.charts.map((data, i) => {
                    var options = isObject(data.options) ? data.options : {};

                    if (!options.resposive) {
                        options.resposive = true;
                    }

                    return (
                        <div className="chart_block" key={i}>
                            <div className="title">{data.title}</div>
                            <div className="description"
                                style={data.description ? { display: 'block' } : { display: 'none' }}
                            >{data.description}</div>
                            <Line className="chart" data={data.config.data} options={options} />
                        </div>
                    )
                })}
            </div>
        } else {
            return null;
        }
    }

}

export default Charts;