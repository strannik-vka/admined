import React, { useEffect, useState } from "react";
import FormFields from "../components/formFields";
import Modal from "../components/modal";
import axios from "axios";

const Form = (props) => {
    const [ajaxProcess, setAjaxProcess] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadQueueTotal, setUploadQueueTotal] = useState(0);
    const [uploadQueueSuccess, setUploadQueueSuccess] = useState(0);

    const errorHide = (name) => {
        setErrors(prevErrors => {
            if (prevErrors && prevErrors[name]) {
                delete prevErrors[name];

                return prevErrors
            } else {
                return prevErrors
            }
        })
    }

    const getUploadQueueName = () => {
        if (props.editItem.id) {
            return false;
        }

        var result = false;

        props.page.form.forEach(input => {
            if (input.upload_queue) {
                result = input.name;
            }
        });

        if (result) {
            if (result.indexOf('[') == -1) {
                result += '[]';
            }
        }

        return result;
    }

    const onSubmit = (e) => {
        e.preventDefault();

        var uploadQueueName = getUploadQueueName(),
            uploadQueueElem = uploadQueueName ? e.target.querySelector('[name="' + uploadQueueName + '"]') : false;

        if (uploadQueueName) {
            setUploadQueueTotal(uploadQueueElem.files.length);
            uploadQueueElem.removeAttribute('name');
        }

        setAjaxProcess(true);

        var data = new FormData(e.target);

        if (props.editItem.id) {
            data.append('_method', 'PUT');
        }

        if (uploadQueueName) {
            uploadQueueElem.setAttribute('name', uploadQueueName);
            data.append(uploadQueueName.replace('[]', ''), uploadQueueElem.files[uploadQueueSuccess]);
        }

        getCopyData(data, data => {
            getGalleryData(data, data => {
                ajaxSend({
                    uploadQueueName: uploadQueueName,
                    data: data,
                    event: e
                });
            });
        });
    }

    const getCopyData = (FormData, callback) => {
        if (props.copyItem.id) {
            let fileElems = document.querySelectorAll('#itemsForm [type="file"]'),
                files = [];

            fileElems.forEach(fileElem => {
                if (!fileElem.multiple) {
                    let previewElem = document.querySelector('#itemsForm [data-preview="' + fileElem.name + '"] [src]');

                    if (previewElem) {
                        let urlArr = previewElem.src.split('.'),
                            extension = urlArr[urlArr.length - 1],
                            name = previewElem.src.replace('.' + extension, '');

                        files.push({
                            fieldName: fileElem.name,
                            url: previewElem.src,
                            name: name,
                            extension: extension
                        });
                    }
                }
            });

            const FormDataFill = (index) => {
                let file = typeof files[index] !== 'undefined' ? files[index] : null;

                if (file) {
                    if (file.name && file.extension) {
                        getBlob(file.url, blobData => {
                            if (blobData) {
                                FormData.append(
                                    file.fieldName,
                                    blobData,
                                    file.name + '.' + file.extension
                                );
                            }

                            setTimeout(() => {
                                FormDataFill(index + 1);
                            }, 0);
                        });
                    }
                } else {
                    callback(FormData);
                }
            }

            FormDataFill(0);
        } else {
            callback(FormData);
        }
    }

    const getGalleryData = (FormData, callback) => {
        let galleries = document.querySelectorAll('#itemsForm .gallery'),
            images = [];

        galleries.forEach(gallery => {
            gallery.querySelectorAll('.image').forEach((image, i) => {
                let name = image.getAttribute('data-name'),
                    extension = image.getAttribute('data-extension');

                images.push({
                    index: i,
                    id: gallery.getAttribute('id'),
                    url: image.getAttribute('src'),
                    name: name,
                    extension: extension
                });
            })
        })

        const FormDataFill = (index) => {
            let image = typeof images[index] !== 'undefined' ? images[index] : null;

            if (image) {
                if (image.name && image.extension) {
                    getBlob(image.url, blobData => {
                        if (blobData) {
                            FormData.append(
                                image.id + '[' + image.index + ']',
                                blobData,
                                image.name + '.' + image.extension
                            );
                        }

                        setTimeout(() => {
                            FormDataFill(index + 1);
                        }, 0);
                    });
                } else {
                    FormData.append(
                        image.id + '[' + image.index + ']',
                        image.url
                    );

                    setTimeout(() => {
                        FormDataFill(index + 1);
                    }, 0);
                }
            } else {
                callback(FormData);
            }
        }

        FormDataFill(0);
    }

    const getBlob = (url, callback) => {
        axios({
            url: url,
            method: 'get',
            responseType: 'blob'
        }).then(response => {
            callback(response.data);
        })
    }

    const ajaxSend = (obj) => {
        let url = location.pathname + '/' + props.page.url,
            stateData = {
                ajaxProcess: false
            };

        if (props.editItem.id) {
            url += '/' + props.editItem.id;
        }

        axios({
            method: 'post',
            url: url,
            data: obj.data,
            processData: false,
            contentType: false,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            if (obj.uploadQueueName) {
                setUploadQueueSuccess(uploadQueueSuccess + 1);
            }

            setAjaxProcess(false);

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else if (response.data.success) {
                props.itemEdit(response.data.success);

                if (obj.uploadQueueName) {
                    if (uploadQueueSuccess == uploadQueueTotal) {
                        setUploadQueueSuccess(0);
                        setUploadQueueTotal(0);

                        props.formVisible(false, true);
                    } else {
                        setTimeout(() => {
                            onSubmit(obj.event);
                        }, 0);
                    }
                } else {
                    props.formVisible(false, true);
                }
            }
        }).catch((error) => {
            this.setState(stateData);

            if (error.response) {
                if (error.response.data) {
                    if (error.response.data.errors) {
                        return setErrors(error.response.data.errors);
                    } else if (error.response.data.error) {
                        return alert(error.response.data.error);
                    }
                }
            }

            alert('Ошибка сервера');
        });
    }

    let title = props.editItem.id ? 'Редактирование' : 'Добавление',
        formData = props.editItem.id ? props.editItem : props.copyItem;

    if (props.copyItem.id) {
        title = 'Дублирование';

        if (formData.published) {
            formData.published = 0;
        }
    }

    useEffect(() => {
        setErrors({});
    }, [props.show])

    return (
        <Modal
            show={props.show}
            onHide={() => props.formVisible(false)}
        >
            <h3 className="title">{title}</h3>
            <form
                id="itemsForm"
                className="form-reverse"
                onSubmit={ajaxProcess ? (e) => { e.preventDefault() } : onSubmit}
            >
                <FormFields
                    page={props.page}
                    inputs={props.page.form}
                    errors={errors}
                    errorHide={(name) => errorHide(name)}
                    editItem={formData}
                />
                <div className="d-flex align-items-center footer">
                    <button
                        type="button"
                        style={{ marginRight: '1rem' }}
                        className="btn btn-save btn-outline"
                        onClick={() => props.formVisible(false)}
                    >Отменить</button>
                    {getUploadQueueName() && ajaxProcess ? <div className="upload_queue_text">Успешно {uploadQueueSuccess} из {uploadQueueTotal}</div> : ''}
                    {props.isPreview ? <button style={{ marginRight: '1rem' }} onClick={() => props.previewVisible(true)} type="button" className="btn">Предпросмотр</button> : ''}
                    <button type="submit" className="btn btn-save" dangerouslySetInnerHTML={{ __html: ajaxProcess ? '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>' : 'Сохранить' }}></button>
                </div>
            </form>
        </Modal>
    )

}

export default Form;