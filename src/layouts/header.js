import React from "react"

import Actions from "./actions"
import Menu from "./menu"

export default (props) => {
    return <header id="header">
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
            itemsDelete={props.itemsDelete}
            showForm={() => props.formVisible(true)}
        />
    </header>
}