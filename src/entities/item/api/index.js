import { backend } from "../../../shared/api"

const config = {
    processData: false,
    contentType: false,
    headers: { 'Content-Type': 'multipart/form-data' },
}

const thenCallback = (response, callback) => {
    callback(response.data)
}

const catchCallback = (error, callback) => {
    if (error.response) {
        if (error.response.data) {
            return callback(error.response.data);
        }
    }

    callback({
        error: 'Ошибка сервера'
    });
}

export const store = (model, data, callback) => {
    backend
        .post(model, data, config)
        .then(response => thenCallback(response, callback))
        .catch((error) => catchCallback(error, callback));
}

export const update = (model, id, data, callback) => {
    backend
        .post(model + '/' + id, data, config)
        .then(response => thenCallback(response, callback))
        .catch((error) => catchCallback(error, callback));
}