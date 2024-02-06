import React, { useCallback, useRef, useState } from "react";
import FileInfo from "./FileInfo";
import axios from "axios";
import InvalidText from "../forms/InvalidText";
import { URLParam } from "../../shared/lib/URLParam";
import { isAudio, isImage } from "../../shared/lib/URLType";

const File = (props) => {
    const value = Array.isArray(props.value) ? props.value : (props.value ? [props.value] : []);

    const inputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(value);

    const onChange = useCallback((event) => {
        setSelectedFiles(event.target.files);
    }, []);

    const onClickDelete = useCallback((url, key) => {
        if (url.indexOf('blob:') > -1) {
            const dt = new DataTransfer()

            if (props.multiple) {
                const newList = [];

                for (let i = 0; i < selectedFiles.length; i++) {
                    let file = selectedFiles[i];

                    if (i !== key) {
                        dt.items.add(file)
                        newList.push(file);
                    }
                }

                inputRef.current.files = dt.files

                setSelectedFiles(newList);
            } else {
                inputRef.current.files = dt.files

                setSelectedFiles([]);
            }
        } else if (url.indexOf('://') > -1) {
            const mewUploadedFiles = uploadedFiles.filter(item => item !== url);

            setUploadedFiles(mewUploadedFiles);
        } else {
            if (confirm('Подтверждаете удаление, отменить будет невозможно?')) {
                axios.get(location.pathname + '/' + URLParam('url'), {
                    params: {
                        id: URLParam('edit_item_id'),
                        name: props.name.replace('[]', ''),
                        url: url,
                        action: 'fileDelete'
                    }
                }).then(() => {
                    const mewUploadedFiles = uploadedFiles.filter(item => item !== url);

                    setUploadedFiles(mewUploadedFiles);
                });
            }
        }
    }, [props.multiple, inputRef, selectedFiles, uploadedFiles, props.name]);

    const onClickDeleteCallback = useCallback((url, key) => {
        if (props.deleteRequest || url.indexOf('blob:') > -1 || url.indexOf('://') > -1) {
            return () => onClickDelete(url, key)
        }

        return null;
    }, [props.deleteRequest])

    const getOtherPreview = (url, key, filesCount) => {
        return (
            <div key={'other_preview_' + key} className="filePreviewOther">
                <a href={url} target="_blank" className="otherFile">
                    Посмотреть файл {filesCount > 1 ? (key + 1) : ''}
                </a>
                <FileInfo url={url} onClickDelete={onClickDeleteCallback(url, key)} />
            </div>
        )
    }

    const getImagePreview = (url, key) => {
        return (
            <div key={'image_preview_' + key} className="filePreviewImage">
                <img src={url} />
                <FileInfo url={url} onClickDelete={onClickDeleteCallback(url, key)} />
            </div>
        )
    }

    const getAudioPreview = (url, key) => {
        return (
            <div key={'audio_preview_' + key} className="filePreviewAudio">
                <div className="audioParent">
                    <audio controls src={url}></audio>
                </div>
                <FileInfo url={url} onClickDelete={onClickDeleteCallback(url, key)} />
            </div>
        )
    }

    const preview = (files, isUrls) => {
        let result = [],
            filesCount = files.length,
            count = filesCount > 9 ? 10 : filesCount;

        for (let i = 0; i < filesCount; i++) {
            let file = files[i];

            if (isUrls) {
                if (isImage(file)) {
                    result.push(getImagePreview(file, i));
                } else if (isAudio(file)) {
                    result.push(getAudioPreview(file, i));
                } else {
                    result.push(getOtherPreview(file, i, filesCount));
                }
            } else {
                if (file.type.includes('image')) {
                    result.push(getImagePreview(URL.createObjectURL(file), i));
                } else if (file.type.includes('audio')) {
                    result.push(getAudioPreview(URL.createObjectURL(file), i));
                } else {
                    result.push(getOtherPreview(URL.createObjectURL(file), i, filesCount));
                }
            }
        }

        return (
            <div data-preview={props.name} className={'previews ' + 'count-' + count}>
                {result}
            </div>
        )
    }

    return <>
        {preview(selectedFiles.length ? selectedFiles : uploadedFiles, !selectedFiles.length)}

        <input
            type="file"
            ref={inputRef}
            onChange={onChange}
            className={props.errors ? 'form-control is-invalid' : 'form-control'}
            name={props.name}
            multiple={props.multiple}
        />

        {uploadedFiles.map(item => {
            if (item.indexOf('://') > -1 || item.indexOf(location.host) === -1) {
                return (
                    <input
                        key={item}
                        type="hidden"
                        name={props.name + '_url'}
                        value={item}
                    />
                )
            }
        })}

        <InvalidText errors={props.errors} />
    </>
}

export default React.memo(File);
