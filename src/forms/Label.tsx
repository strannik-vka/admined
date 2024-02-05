import React from "react"
import styles from '../scss/forms/Label.module.scss'

const Label = (props) => {
    return (
        <label className={styles.label}>{props.text}</label>
    )
}

export default Label