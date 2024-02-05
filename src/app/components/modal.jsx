import React from "react";
import { addClass, removeClass } from "../../shared/lib/DomElement";
import { getScrollBarWidth } from "../../shared/lib/ScrollBar";

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
                <div className={'modal-dialog modal-dialog-centered ' + (props.modalSize ? props.modalSize : 'modal-lg')}>
                    <div className="modal-content">
                        <div className="modal-body">
                            {!props.closeHide &&
                                <button type="button" className="btn-close" onClick={props.onHide}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000"><path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z" /></svg>
                                </button>
                            }
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </> : ''}
    </>
}