import React, { forwardRef } from 'react';
import styles from '../../../app/scss/shared/ui/Constructor/PlusButtonPopover.module.scss';
import Popover from '../Popover';

const PlusButtonPopover = (props) => {
    const label = props.label;

    const onItemClick = (field) => {
        if (props.onItemClick) {
            props.onItemClick(field);
        }
    }

    return (
        <Popover
            flipPlacements={['top', 'bottom', (props.placement ? props.placement : 'right')]}
            placement={props.placement ? props.placement : 'right'}
            ReferenceElem={
                forwardRef((props, { ref, refParent }) =>
                    <div {...props} ref={refParent} className={styles['btn-wrap']}>
                        <div ref={ref} className={'svg-icon ' + styles['svg-icon']}>
                            <svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg>
                        </div>
                        {label}
                    </div>
                )
            }
        >
            <div className={styles.fields}>
                {
                    props.fields.map((field, index) => (
                        <div
                            key={index} className={styles.field}
                            onClick={() => onItemClick(field)}
                        >
                            <div
                                className={styles.icon}
                                dangerouslySetInnerHTML={{ __html: field.svg }}
                            ></div>
                            <div>
                                <div className={styles.label}>{field.label}</div>
                                <div className={styles.description}>{field.description}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Popover>
    )
}

export default React.memo(PlusButtonPopover)