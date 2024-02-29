import React from "react";

export const FormHeader = (props) => {
    let title = props.isEdit ? 'Редактирование' : 'Добавление';

    if (props.isCopy) {
        title = 'Дублирование';
    }

    return (
        <h3 className="title">{title}</h3>
    )
}