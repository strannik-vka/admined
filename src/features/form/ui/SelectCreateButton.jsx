import React from "react"
import { isObject } from "../../shared/lib/IsObject"
import styles from '../../../app/scss/fetures/form/SelectCreateButton.module.scss'

const SelectCreateButton = (props) => {
    let options = isObject(props.options) ? props.options : { url: false }

    if (typeof props.options === 'string') {
        options.model = props.options;
    }

    if (options.model) {
        options.url = location.pathname + '/?url=' + options.model;
    }

    if (!options.url) {
        let nameArr = props.inputName.split('_');

        options.url = location.pathname + '/?url=' + nameArr[0];
    }

    options.url += '&ad_form_show=true';

    return (
        <a className={styles.btn} href={options.url} target="_blank">добавить</a>
    )
}

export default React.memo(SelectCreateButton)