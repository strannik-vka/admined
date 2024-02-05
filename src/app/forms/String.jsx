import React from "react";

const String = (props) => {
    return (
        <input
            name={props.name}
            type={props.type}
            className={'form-control ' + (props.errors && 'is-invalid')}
            onInput={props.onInput}
            defaultValue={props.value}
            required={props.required}
        />
    )
}

export default String;