import React from "react";

class File extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }

    onChange = (event) => {
        if (this.props.onInput) {
            this.props.onInput(event);
        }

        this.setState({
            files: event.target.files
        });
    }

    files() {
        let result = [],
            files = Array.isArray(this.props.value) ? this.props.value : (this.props.value ? [this.props.value] : []),
            isImages = isImage(files[0]);

        if (isImages) {
            result = this.preview(files, true);
        } else {
            files.forEach((file, i) => {
                result.push(<a key={i} href={file} target="_blank" className="download_file">Посмотреть файл {i + 1}</a>);
            });
        }

        return result;
    }

    preview(files, isUrls) {
        let result = [],
            filesCount = files.length,
            count = 0;

        if (filesCount > 9) {
            count = 10;
        } else if (filesCount > 8) {
            count = 9;
        } else if (filesCount > 7) {
            count = 8;
        } else if (filesCount > 6) {
            count = 7;
        } else if (filesCount > 5) {
            count = 6;
        } else if (filesCount > 4) {
            count = 5;
        } else if (filesCount > 3) {
            count = 4;
        } else if (filesCount > 2) {
            count = 3;
        } else if (filesCount > 0) {
            count = 1;
        }

        for (let i = 0; i < filesCount; i++) {
            let file = files[i];

            if (isUrls) {
                result.push(<img className="filePreviewImage" key={'preview_' + i} src={file} />);
            } else {
                if (file.type.includes('image')) {
                    result.push(<img className="filePreviewImage" key={'preview_' + i} src={URL.createObjectURL(file)} />);
                }
            }
        }

        return <div className={'previews ' + 'count-' + count}>{result}</div>;
    }

    render() {
        return (
            <>
                {this.files()}
                {this.preview(this.state.files)}
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