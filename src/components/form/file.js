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

    files() {
        var result = [];

        if (typeof this.props.value === 'object' && this.props.value != null) {
            this.props.value.forEach((file, i) => {
                result.push(<a href={file} target="_blank" class="download_file">Посмотреть файл {i + 1}</a>);
            });
        } else if (this.props.value) {
            result.push(<a href={this.props.value} target="_blank" class="download_file">Посмотреть файл</a>);
        }

        return result;
    }

    render() {
        return (
            <>
                {this.files()}
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