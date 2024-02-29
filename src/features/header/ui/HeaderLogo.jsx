import React from "react"

const HeaderLogo = () => {
    const domainSplit = location.host.split('.');

    return (
        <a
            target="_blank"
            href={location.origin}
            className="siteName"
        >{domainSplit[0]}</a>
    )
}

export default React.memo(HeaderLogo)