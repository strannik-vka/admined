import React from "react"
import styles from '../scss/forms/Description.module.scss'

const Description = (props) => {
    if (props.text) {
        return (
            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: props.text }}
            ></div>
        )
    }

    return null
}

export default Description