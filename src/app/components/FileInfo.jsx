import React, { useCallback } from 'react';
import styles from '../scss/components/FileInfo.module.scss';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const FileSize = React.memo((props) => {
    const getFileSize = useCallback((url) => {
        if (url.indexOf('://') > -1) {
            if (url.indexOf(location.host) === -1) {
                return false;
            }
        }

        const req = new XMLHttpRequest();

        req.open("GET", url, false);
        req.send();

        const bytes = req.getResponseHeader('content-length');

        if (!+bytes) return '0 кб';

        const k = 1024
        const sizes = ['байт', 'кб', 'мб', 'гб']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`
    }, []);

    return (
        <div className={styles.size}>{getFileSize(props.url)}</div>
    )
})

const FileDelete = React.memo((props) => {
    return (props.onClickDelete &&
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip>Удалить файл</Tooltip>
            }
        >
            <svg onClick={props.onClickDelete} className={styles.delete} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.53125 4.01094C0.345313 4.01094 0.199219 3.86485 0.199219 3.67891C0.199219 3.49297 0.345313 3.34688 0.53125 3.34688L16.1367 3.37344C16.3227 3.37344 16.4688 3.51953 16.4688 3.70547C16.4688 3.89141 16.3227 4.0375 16.1367 4.0375L0.53125 4.01094ZM3.09453 4.68828C3.09453 4.50235 3.24062 4.35625 3.42656 4.35625C3.6125 4.35625 3.75859 4.50235 3.75859 4.68828V16.1234L13.4805 16.0172V4.80782C13.4805 4.62188 13.6266 4.47578 13.8125 4.47578C13.9984 4.47578 14.1445 4.62188 14.1445 4.80782V16.7078L3.08125 16.8273V4.68828H3.09453Z" fill="currentColor" />
                <path d="M11.3289 14.3969C11.143 14.3969 10.9969 14.2508 10.9969 14.0648V6.17578C10.9969 5.98984 11.143 5.84374 11.3289 5.84374C11.5149 5.84374 11.661 5.98984 11.661 6.17578V14.0648C11.6742 14.2508 11.5149 14.3969 11.3289 14.3969ZM6.09611 14.3969C5.91017 14.3969 5.76408 14.2508 5.76408 14.0648V6.17578C5.76408 5.98984 5.91017 5.84374 6.09611 5.84374C6.28204 5.84374 6.42814 5.98984 6.42814 6.17578V14.0648C6.44142 14.2508 6.28204 14.3969 6.09611 14.3969ZM8.71251 14.3969C8.52657 14.3969 8.38048 14.2508 8.38048 14.0648V6.17578C8.38048 5.98984 8.52657 5.84374 8.71251 5.84374C8.89845 5.84374 9.04454 5.98984 9.04454 6.17578V14.0648C9.05782 14.2508 8.89845 14.3969 8.71251 14.3969ZM10.8774 3.54609V2.73593C10.8774 2.44374 10.6383 2.20468 10.3461 2.20468H6.94611C6.64064 2.20468 6.41486 2.44374 6.41486 2.74921V3.45312H5.75079V2.74921C5.75079 2.08515 6.29533 1.54062 6.95939 1.54062H10.3594C11.0234 1.54062 11.568 2.08515 11.568 2.74921V3.55937H10.8774V3.54609Z" fill="currentColor" />
            </svg>
        </OverlayTrigger>
    )
})

const FileInfo = React.memo((props) => {
    return (
        <div className={styles.wrap}>
            <FileSize url={props.url} />
            <FileDelete onClickDelete={props.onClickDelete} />
        </div>
    )
})

export default FileInfo