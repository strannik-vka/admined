import moduleStyles from '../../app/scss/shared/ui/Popover.module.scss';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { usePopper } from 'react-popper';

const Popover = ({ ReferenceElem, children, flipPlacements, placement, hideOutsideClick }) => {
    const [isShow, setIsShow] = useState(false);
    const [refParent, setRefParent] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

    let options = {
        modifiers: [
            {
                name: 'arrow',
                options: {
                    element: arrowElement
                }
            },
            {
                name: 'offset',
                options: {
                    offset: [0, 6],
                },
            },
        ],
        strategy: 'fixed',
    }

    if (placement) {
        options.placement = placement;
    }

    if (Array.isArray(flipPlacements)) {
        options.modifiers.push({
            name: 'flip',
            options: {
                fallbackPlacements: flipPlacements,
            },
        });
    }

    hideOutsideClick = typeof hideOutsideClick !== 'undefined' ? hideOutsideClick : true;

    const { styles, attributes } = usePopper(referenceElement, popperElement, options);

    const documentClick = (e) => {
        if (
            (e.target != referenceElement && !referenceElement.contains(e.target)) &&
            (e.target != popperElement && !popperElement.contains(e.target)) &&
            (e.target != arrowElement && !arrowElement.contains(e.target)) &&
            (refParent ? (e.target != refParent && !refParent.contains(e.target)) : true)
        ) {
            setIsShow(false)
        }
    }

    useEffect(() => {
        if (hideOutsideClick) {
            if (referenceElement && popperElement && arrowElement) {
                document.addEventListener('click', documentClick);

                return () => {
                    document.removeEventListener('click', documentClick);
                }
            }
        }
    }, [referenceElement, popperElement, arrowElement, refParent, isShow]);

    return <>
        <ReferenceElem
            ref={{ ref: setReferenceElement, refParent: setRefParent }}
            onClick={() => setIsShow(!isShow)}
        />
        <div
            ref={setPopperElement}
            className={moduleStyles.popover + (isShow ? '' : ' ' + moduleStyles.hide)}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className={moduleStyles.body}>
                {children}
            </div>
            <div
                ref={setArrowElement}
                className={moduleStyles.arrow}
                style={styles.arrow}
            />
        </div >
    </>
}

export default Popover;