import React from "react";

class File extends React.Component {

    constructor(props) {
        super(props);
    }

    onChange = (event) => {
        if (this.props.onInput) {
            this.props.onInput(event);
        }
    }

    render() {
        return (
            <>
                <input
                    className={this.props.errors ? 'form-control is-invalid' : 'form-control'}
                    onChange={this.onChange}
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