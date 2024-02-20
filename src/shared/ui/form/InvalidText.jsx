import React from "react"

const InvalidText = (props) => {
    if (props.errors) {
        return (
            <div
                className="invalid-feedback"
                dangerouslySetInnerHTML={{ __html: props.errors.join('<br />') }}
            ></div>
        )
    }

    return null
}

export default InvalidText