import axios from 'axios'

export const backend = axios.create({
    baseURL: location.pathname + '/',
    headers: {
        'Content-type': 'application/json'
    }
})