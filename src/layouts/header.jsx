import React from "react"

import Actions from "./actions"
import Menu from "./menu"

export default (props) => {
    let avatar = null;

    if (props.user.id) {
        avatar = props.user.name.split(' ');

        avatar = avatar.length > 1
            ? avatar[0][0] + avatar[1][0]
            : avatar[0][0];
    }

    let siteName = location.host.split('.');
    siteName = siteName[0];

    return (
        <header id="header">
            <div className="menu-wrap">
                <a target="_blank" href={location.origin} className="siteName">{siteName}</a>
                <Menu
                    isDomRender={props.isDomRender}
                    pages={props.pages}
                    page={props.page}
                    changePage={props.changePage}
                />
                {props.user.id &&
                    <div className="user">
                        <div className="avatar">{avatar}</div>
                        <div className="links shadow">
                            <div className="name">{props.user.name}</div>
                            <a target="_blank" href={location.origin}>Открыть сайт</a>
                            <a href="/logout">Выйти</a>
                        </div>
                    </div>
                }
            </div>
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
    )
}