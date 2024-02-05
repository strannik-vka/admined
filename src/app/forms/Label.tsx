import React from "react"
import styles from '../scss/forms/Label.module.scss'

const Label = (props) => {
    if (props.text) {
        return (
            <label className={styles.label}>{props.text}</label>
        )
    }

    return null
}

export default Label