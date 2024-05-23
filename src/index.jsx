import React from "react";
import ReactDOM from 'react-dom';
import Admined from "./app/Admined";

const AdminedDOM = ReactDOM.render(
    <Admined />,
    document.getElementById('admined')
)

window.Admined = {
    setItemsUpdateSeconds: (...args) => {
        AdminedDOM.setItemsUpdateSeconds(...args);
    },

    page: (...args) => {
        AdminedDOM.page(...args);
    }
}