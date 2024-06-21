import React from "react"
import { isObject } from "../../../shared/lib/IsObject"
import styles from '../../../app/scss/fetures/form/LabelRightButton.module.scss'
import { OverlayTrigger, Tooltip } from "react-bootstrap"

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
        <a className={styles.btn} href={options.url} target="_blank">
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip>Добавить пункт</Tooltip>
                }
            >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 0C3.81315 0 0 3.81315 0 8.5C0 13.1869 3.81315 17 8.5 17C13.1869 17 17 13.1869 17 8.5C17 3.81315 13.1869 0 8.5 0ZM11.7692 9.15385H9.15385V11.7692C9.15385 11.9426 9.08496 12.109 8.96234 12.2316C8.83972 12.3542 8.67341 12.4231 8.5 12.4231C8.32659 12.4231 8.16028 12.3542 8.03766 12.2316C7.91504 12.109 7.84615 11.9426 7.84615 11.7692V9.15385H5.23077C5.05736 9.15385 4.89105 9.08496 4.76843 8.96234C4.64581 8.83972 4.57692 8.67341 4.57692 8.5C4.57692 8.32659 4.64581 8.16028 4.76843 8.03766C4.89105 7.91504 5.05736 7.84615 5.23077 7.84615H7.84615V5.23077C7.84615 5.05736 7.91504 4.89105 8.03766 4.76843C8.16028 4.64581 8.32659 4.57692 8.5 4.57692C8.67341 4.57692 8.83972 4.64581 8.96234 4.76843C9.08496 4.89105 9.15385 5.05736 9.15385 5.23077V7.84615H11.7692C11.9426 7.84615 12.109 7.91504 12.2316 8.03766C12.3542 8.16028 12.4231 8.32659 12.4231 8.5C12.4231 8.67341 12.3542 8.83972 12.2316 8.96234C12.109 9.08496 11.9426 9.15385 11.7692 9.15385Z" fill="currentColor" />
                </svg>
            </OverlayTrigger>
        </a>
    )
}

export default React.memo(SelectCreateButton)