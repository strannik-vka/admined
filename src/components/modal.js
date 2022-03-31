import React from "react";

export default (props) => {
    let styles = null,
        scrollBarWidth = getScrollBarWidth();

    if (props.show) {
        styles = {
            display: 'block',
            paddingLeft: (scrollBarWidth - 1) + 'px'
        }

        document.body.setAttribute('style', 'overflow: hidden;padding-right: ' + scrollBarWidth + 'px;');

        addClass(document.body, 'modal-open');
    } else {
        document.body.removeAttribute('style');

        removeClass(document.body, 'modal-open');
    }

    return <>
        {props.show ? <>
            <div className="fade modal-backdrop show"></div>
            <div role="dialog" className="fade modal show" style={styles}>
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="btn-close" onClick={props.onHide}></button>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </> : ''}
    </>
}