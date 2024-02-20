import React, { useState } from "react";
import String from './String';
import styles from '../../../app/scss/shared/ui/forms/StringVideo.module.scss';

const StringVideo = (props) => {
    const [text, setText] = useState(props.value ? props.value : '');

    const onInputHandler = (event) => {
        setText(event.target.value);

        if (typeof props.onInput === 'function') {
            props.onInput(event.target.value, event);
        }
    }

    const Preview = ({ src }) => {
        if (src) {
            if (src.indexOf('iframe') == -1) {
                if (src.indexOf('youtu') > -1) {
                    let match = src.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
                    if ((match && match[7].length == 11)) {
                        src = 'https://www.youtube.com/embed/' + match[7];
                    }
                } else if (src.indexOf('ok.ru') > -1 && src.indexOf('video/') > -1) {
                    let srcArr = src.split('video/');
                    src = 'https://ok.ru/videoembed/' + srcArr[1];
                } else if (src.indexOf('vimeo.com') > -1 && src.indexOf('player') == -1) {
                    let srcArr = src.split('vimeo.com/');
                    src = 'https://player.vimeo.com/video/' + srcArr[1];
                } else {
                    src = null;
                }

                if (src) {
                    return (
                        <div className={styles.videoPreview}>
                            <iframe height="300" src={src} frameBorder="0"></iframe>
                        </div>
                    )
                }
            }

            return (
                <div
                    className={styles.videoPreview}
                    dangerouslySetInnerHTML={{ __html: src }}
                ></div>
            )
        }

        return null;
    }

    return (
        <>
            <Preview src={text} />
            <String {...props} value={text} onInput={onInputHandler} />
        </>
    )
}

export default React.memo(StringVideo);
