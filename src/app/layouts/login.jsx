import { useState } from "react"
import Input from "../components/input"
import Modal from "../components/modal"
import Switch from "../components/switch"
import axios from "axios"
import React from "react";
import Label from "../forms/Label"

export default () => {
    const [ajaxProcess, setAjaxProcess] = useState(false);
    const [emailErrors, setEmailErrors] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState(false);

    const onRespone = (response) => {
        if (response.errors) {
            if (response.errors.email) {
                setEmailErrors(response.errors.email);
            }

            if (response.errors.password) {
                setPasswordErrors(response.errors.password);
            }
        } else if (response.error) {
            alert(response.error);
        } else {
            location.href = location.href.replace('?url=login', '');
        }

        setAjaxProcess(false);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        setAjaxProcess(true);

        let data = new FormData(e.target);

        axios({
            method: 'post',
            url: '/login',
            data: data,
        }).then((response) => {
            onRespone(response.data);
        }).catch((error) => {
            onRespone(error.response.data);
        });
    }

    const onInput = (event) => {
        if (event.target.name == 'email') {
            setEmailErrors(false);
        }

        if (event.target.name == 'password') {
            setPasswordErrors(false);
        }
    }

    return <Modal
        show={true}
        closeHide={true}
        modalSize='modal-sm'
    >
        <form
            method="POST"
            action="/login"
            onSubmit={(e) => { if (ajaxProcess) return false; onSubmit(e) }}
        >
            <h3 className="mt-0 mb-3">Авторизация</h3>
            <div className="form-group mb-3">
                <Label text="Email" />
                <Input
                    name="email"
                    email={true}
                    required={true}
                    errors={emailErrors}
                    onInput={onInput}
                />
            </div>
            <div className="form-group mb-3">
                <Label text="Пароль" />
                <Input
                    name="password"
                    password={true}
                    required={true}
                    errors={passwordErrors}
                />
            </div>
            <div className="form-group mb-3">
                <Switch
                    value="1"
                    checked={true}
                    name="remember"
                    placeholder="Запомнить меня"
                />
            </div>
            <button type="submit" className="btn btn-block" dangerouslySetInnerHTML={{ __html: ajaxProcess ? '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>' : 'Войти' }}></button>
        </form>
    </Modal>
}