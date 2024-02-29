import React from "react"

const HeaderUser = (props) => {
    let avatar = null;

    if (props.user.name) {
        const nameSplit = props.user.name.split(' ');

        avatar = nameSplit.length > 1
            ? nameSplit[0][0] + nameSplit[1][0]
            : nameSplit[0][0];
    }

    return (props.user.id &&
        <div className="user">
            <div className="avatar">{avatar}</div>
            <div className="links shadow">
                <div className="name">{props.user.name}</div>
                <a target="_blank" href={location.origin}>Открыть сайт</a>
                <a href="/logout">Выйти</a>
            </div>
        </div>
    )
}

export default React.memo(HeaderUser)