import React from "react";

class Checkbox extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <label className="form-check not-label">
                <input {...this.props} className="form-check-input" type="checkbox" />
            </label>
        );
    }

}

export default Checkbox;