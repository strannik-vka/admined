import React, { useState } from "react";
import styles from '../../../app/scss/fetures/form/LabelRightButton.module.scss';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { URLParam } from "../../../shared/lib/URLParam";
import { hasStorage, storage } from "../../../shared/lib/Storage";

const SaveValueButton = (props) => {
    const inputKey = URLParam('url') + '_' + props.inputName;

    const [active, setActive] = useState(hasStorage(inputKey) ? 1 : 0);

    const onClick = () => {
        const newActive = hasStorage(inputKey) ? 0 : 1;
        const inputElem = document.querySelector('#itemsForm [name="' + props.inputName + '"]');

        if (newActive) {
            storage(inputKey, inputElem.value);
        } else {
            storage(inputKey, null);
        }

        setActive(newActive)
    }

    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip>Запомнить поле</Tooltip>
            }
        >
            <svg onClick={onClick} className={styles.btn + (active ? ' ' + styles.active : '')} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.88097 3.55128L5.34947 4.78733C5.31239 4.86149 5.30003 4.91093 5.26295 4.93565C5.23941 4.96596 5.20998 4.99119 5.17643 5.00982C5.13934 5.03454 5.0899 5.03454 4.99102 5.0469L4.22467 5.1705C2.03687 5.46715 0.949149 5.62784 0.491812 6.13462C0.293944 6.35227 0.149576 6.61309 0.070184 6.89632C-0.00920791 7.17956 -0.0214347 7.47741 0.0344755 7.7662C0.170441 8.44603 1.03567 9.12585 2.75378 10.5102L3.05043 10.7574C3.12459 10.8192 3.17403 10.844 3.18639 10.881C3.21242 10.9177 3.22937 10.9601 3.23583 11.0046L3.21111 11.19L3.12459 11.6597C2.64253 14.206 2.40768 15.4791 2.7785 16.0971C2.94039 16.3617 3.16487 16.5824 3.43215 16.7397C3.69943 16.8971 4.00131 16.9863 4.31119 16.9995C5.04046 17.0242 6.04166 16.196 8.01933 14.5397L8.36542 14.2678C8.46431 14.1689 8.51375 14.1318 8.57555 14.1195C8.628 14.104 8.68379 14.104 8.73624 14.1195C8.79804 14.1318 8.84748 14.1689 8.94636 14.2554L9.29246 14.5521C11.2701 16.196 12.2713 17.0242 13.0006 16.9995C13.3105 16.9863 13.6124 16.8971 13.8796 16.7397C14.1469 16.5824 14.3714 16.3617 14.5333 16.0971C14.9041 15.4791 14.6693 14.206 14.1872 11.6474L14.1007 11.19C14.0833 11.1298 14.0749 11.0673 14.076 11.0046C14.0824 10.9601 14.0994 10.9177 14.1254 10.881L14.2614 10.7574L14.558 10.5102C16.2761 9.13821 17.1413 8.44603 17.2773 7.7662C17.3332 7.47741 17.321 7.17956 17.2416 6.89632C17.1622 6.61309 17.0178 6.35227 16.82 6.13462C16.3626 5.62784 15.2749 5.46715 13.0871 5.15814L12.3208 5.0469C12.2219 5.0469 12.1724 5.03454 12.1354 5.00982C12.1018 4.99119 12.0724 4.96596 12.0488 4.93565C12.0118 4.91093 11.9994 4.86149 11.9623 4.77497L11.4308 3.53892C10.5532 1.52417 10.1206 0.510612 9.50259 0.2016C9.24003 0.0690528 8.95001 0 8.65589 0C8.36177 0 8.07176 0.0690528 7.8092 0.2016C7.19118 0.510612 6.75856 1.52417 5.88097 3.53892V3.55128Z" fill="currentColor" />
            </svg>
        </OverlayTrigger>
    )
}

export default React.memo(SaveValueButton);