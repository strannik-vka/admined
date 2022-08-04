import React from "react";

class File extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFiles: []
        }
    }

    onChange = (event) => {
        if (this.props.onInput) {
            this.props.onInput(event);
        }

        this.setState({
            selectedFiles: event.target.files
        });
    }

    getOtherPreview(url, key, filesCount) {
        return <a key={'other_preview_' + key} href={url} target="_blank" className="download_file">Посмотреть файл {filesCount ? (key + 1) : ''}</a>
    }

    getImagePreview(url, key) {
        return <img key={'image_preview_' + key} className="filePreviewImage" src={url} />
    }

    getAudioPreview(url, key) {
        return <div key={'audio_preview_' + key} className="filePreviewAudio">
            <audio controls src={url}></audio>
        </div>
    }

    preview(files, isUrls) {
        if (isUrls) {
            files = Array.isArray(files) ? files : (files ? [files] : []);
        }

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
                if (isImage(file)) {
                    result.push(this.getImagePreview(file, i));
                } else if (isAudio(file)) {
                    result.push(this.getAudioPreview(file, i));
                } else {
                    result.push(this.getOtherPreview(file, i, filesCount));
                }
            } else {
                if (file.type.includes('image')) {
                    result.push(this.getImagePreview(URL.createObjectURL(file), i));
                } else if (file.type.includes('audio')) {
                    result.push(this.getAudioPreview(URL.createObjectURL(file), i));
                }
            }
        }

        return <div data-preview={this.props.name} className={'previews ' + 'count-' + count}>{result}</div>;
    }

    render() {
        return <>
            {this.state.selectedFiles.length
                ? this.preview(this.state.selectedFiles)
                : this.preview(this.props.value, true)
            }
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
    }

}

export default File;