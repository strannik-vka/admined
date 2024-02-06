import { backend } from "../../../shared/api"

export const fetchMetaData = (url, callback) => {
    backend.get('url-meta-data', {
        params: {
            url: url
        }
    }).then(response => {
        const keys = Object.keys(response.data)

        let result = {}

        // default
        if (response.data?.title) {
            result.title = response.data.title;
        } else if (response.data?.description) {
            result.description = response.data.description;
        } else if (response.data?.image) {
            result.image = response.data.image;
        }

        // og and socials
        keys.forEach(key => {
            if (key.indexOf(':title') > -1) {
                result.title = response.data[key];
            } else if (key.indexOf(':description') > -1) {
                result.description = response.data[key];
            } else if (key.indexOf(':image') > -1) {
                if (response.data[key].indexOf('://') > -1) {
                    result.image = response.data[key];
                }
            }
        })

        // important
        if (response.data['twitter:image']) {
            result.image = response.data['twitter:image'];
        }

        callback(result);
    })
}