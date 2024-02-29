import React from "react"

import HeaderActions from "../../../features/header/ui/HeaderActions"
import HeaderMenu from "../../../features/header/ui/HeaderMenu"
import HeaderLogo from "../../../features/header/ui/HeaderLogo";
import HeaderUser from "../../../features/header/ui/HeaderUser";

const Header = (props) => {
    return (
        <header id="header">
            <div className="menu-wrap">
                <HeaderLogo />
                <HeaderMenu
                    isDomRender={props.isDomRender}
                    pages={props.pages}
                    page={props.page}
                    changePage={props.changePage}
                />
                <HeaderUser
                    user={props.user}
                />
            </div>
            <HeaderActions
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

export default React.memo(Header);