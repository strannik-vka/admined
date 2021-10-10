import React from "react";

class File extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <input
                    className={this.props.errors ? 'form-control is-invalid' : 'form-control'}
                    onChange={this.props.errorHide}
                    type="file"
                    name={this.props.name}
                    multiple={this.props.multiple}
                />
                {
                    this.props.errors
                        ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                        : ''
                }
            </>
        );
    }

}

export default File;