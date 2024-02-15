import React from "react";

export const ItemFormFooter = (props) => {
    return (
        <div className="d-flex align-items-center footer">
            <button
                type="button"
                className="btn btn-save btn-outline"
                style={{ marginRight: '1rem' }}
                onClick={props.onCancel}
            >Отменить</button>

            {(props.isUploadQueue && props.isSending) &&
                <div className="upload_queue_text">
                    Успешно {props.uploadQueueSuccess} из {props.uploadQueueTotal}
                </div>
            }

            {props.isPreview &&
                <button
                    type="button"
                    className="btn"
                    style={{ marginRight: '1rem' }}
                    onClick={props.onPreviewShow}
                >Предпросмотр</button>
            }

            <button
                type="submit"
                className="btn btn-save"
                dangerouslySetInnerHTML={{ __html: props.isSending ? '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>' : 'Сохранить' }}
            ></button>
        </div>
    )
}