import React, { useEffect, useState } from "react";
import axios from "axios";
import FormFields from "../../../../app/components/formFields";
import Modal from "../../../../shared/ui/Modal";
import { ItemApi } from "../../../../entities/item";
import { ItemFormHeader } from "./ItemFormHeader";
import { ItemFormFooter } from "./ItemFormFooter";

export const ItemForm = (props) => {
    const [ajaxProcess, setAjaxProcess] = useState(false);
    const [errors, setErrors] = useState(null);
    const [uploadQueueTotal, setUploadQueueTotal] = useState(0);
    const [uploadQueueSuccess, setUploadQueueSuccess] = useState(0);

    const errorHide = (name) => {
        setErrors(prevErrors => {
            const errors = prevErrors !== null ? JSON.parse(prevErrors) : null;

            if (prevErrors && errors[name]) {
                delete errors[name];

                return JSON.stringify(errors)
            }

            return prevErrors
        })
    }

    const getUploadQueueName = () => {
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
        if (e) {
            e.preventDefault();
        }

        var uploadQueueName = getUploadQueueName();

        if (uploadQueueName) {
            const form = document.getElementById('itemsForm');
            const uploadQueueElem = form.querySelector('[name="' + uploadQueueName + '"]');
            setUploadQueueTotal(uploadQueueElem.files.length);
        }

        setAjaxProcess(true);
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

    const sendCallback = (response, obj) => {
        const form = document.getElementById('itemsForm');
        const uploadQueueName = getUploadQueueName();

        if (uploadQueueName) {
            const uploadQueueElem = form.querySelector('[data-name="' + uploadQueueName + '"]');

            uploadQueueElem.setAttribute('name', uploadQueueName);
            uploadQueueElem.removeAttribute('data-name');
        }

        if (response.success) {
            let newUploadQueueSuccess = 0;

            if (obj.uploadQueueName) {
                newUploadQueueSuccess = uploadQueueSuccess + 1;
                setUploadQueueSuccess(newUploadQueueSuccess);
            }

            props.itemEdit(response.success);

            if (obj.uploadQueueName) {
                if (newUploadQueueSuccess >= uploadQueueTotal) {
                    setUploadQueueSuccess(0);
                    setUploadQueueTotal(0);

                    props.formVisible(false, true);
                } else {
                    setTimeout(() => {
                        onSubmit();
                    }, 0);
                }
            } else {
                props.formVisible(false, true);
            }
        } else if (response.errors) {
            setErrors(JSON.stringify(response.errors));
        } else if (response.error) {
            alert(response.error);
        }

        setAjaxProcess(false);
    }

    const formSend = () => {
        const form = document.getElementById('itemsForm');

        const uploadQueueName = getUploadQueueName();

        let uploadQueueElem = null;

        if (uploadQueueName) {
            uploadQueueElem = form.querySelector('[name="' + uploadQueueName + '"]');

            uploadQueueElem.removeAttribute('name');
            uploadQueueElem.setAttribute('data-name', uploadQueueName);
        }

        let data = new FormData(form);

        if (uploadQueueName) {
            if (uploadQueueElem.files[uploadQueueSuccess]) {
                data.append(
                    uploadQueueName.replace('[]', ''),
                    uploadQueueElem.files[uploadQueueSuccess]
                );
            }
        }

        getCopyData(data, data => {
            getGalleryData(data, data => {
                const obj = {
                    uploadQueueName: uploadQueueName,
                    data: data,
                }

                if (props.editItem.id) {
                    ItemApi.update(
                        props.page.url,
                        props.editItem.id,
                        obj.data,
                        (response) => sendCallback(response, obj)
                    )
                } else {
                    ItemApi.store(
                        props.page.url,
                        obj.data,
                        (response) => sendCallback(response, obj)
                    )
                }
            });
        });
    }

    const preventDefault = (e) => {
        e.preventDefault()
    }

    let formData = props.editItem.id ? props.editItem : props.copyItem;

    if (props.copyItem.id) {
        if (formData.published) {
            formData.published = 0;
        }
    }

    useEffect(() => {
        setErrors(null);
    }, [props.show])

    useEffect(() => {
        if (ajaxProcess) {
            formSend()
        }
    }, [ajaxProcess])

    return (
        <Modal
            show={props.show}
            onHide={() => props.formVisible(false)}
        >
            <ItemFormHeader
                isEdit={props.editItem.id}
                isCopy={props.copyItem.id}
            />

            <form
                id="itemsForm"
                className="form-reverse"
                onSubmit={ajaxProcess ? preventDefault : onSubmit}
            >
                <FormFields
                    page={props.page}
                    inputs={props.page.form}
                    errors={errors !== null ? JSON.parse(errors) : null}
                    errorHide={(name) => errorHide(name)}
                    editItem={formData}
                />

                <ItemFormFooter
                    onCancel={() => props.formVisible(false)}
                    isUploadQueue={getUploadQueueName()}
                    uploadQueueSuccess={uploadQueueSuccess}
                    uploadQueueTotal={uploadQueueTotal}
                    isPreview={props.isPreview}
                    onPreviewShow={() => props.previewVisible(true)}
                    isSending={ajaxProcess}
                />

                {props.editItem.id &&
                    <input type="hidden" name="_method" value="PUT" />
                }
            </form>
        </Modal>
    )

}