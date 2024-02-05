import styles from '../scss/forms/Description.module.scss'

const Description = (props) => {
    return (
        <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: props.text }}
        ></div>
    )
}

export default Description