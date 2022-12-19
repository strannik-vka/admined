import React from "react"

import Actions from "./actions"
import Menu from "./menu"

export default (props) => {
    let user = null;

    if (isObject(props.user)) {
        let avatar = props.user.name.split(' ');

        avatar = avatar.length > 1
            ? avatar[0][0] + avatar[1][0]
            : avatar[0][0];

        user = <div className="user">
            <div className="avatar">{avatar}</div>
            <div className="links shadow">
                <div className="name">{props.user.name}</div>
                <a target="_blank" href={location.origin}>Открыть сайт</a>
                <a href="/logout">Выйти</a>
            </div>
        </div>
    }

    let siteName = location.host.split('.');
    siteName = siteName[0];

    return <header id="header">
        <a target="_blank" href={location.origin} className="siteName">{siteName}</a>
        {user}
        <Menu
            isDomRender={props.isDomRender}
            pages={props.pages}
            page={props.page}
            changePage={props.changePage}
        />
        <Actions
            page={props.page}
            to={props.to}
            total={props.total}
            saveStatus={props.saveStatus}
            itemsSelected={props.itemsSelected}
            showForm={() => props.formVisible(true)}
            items={props.items}
        />
    </header>
}