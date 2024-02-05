const InvalidText = (props) => {
    return (props.errors &&
        <div
            className="invalid-feedback"
            dangerouslySetInnerHTML={{ __html: props.errors.join('<br />') }}
        ></div>
    )
}

export default InvalidText