import axios from "axios";
import React, { useEffect, useState } from "react"
import { isObject } from "../../shared/lib/isObject";
import { URLParam } from "../../shared/lib/URLParam";
import { getDataValue } from "../../shared/lib/GetDataValue";

const getFormData = (userFunction, callback) => {
    let formData = new FormData(document.querySelector('#itemsForm'));

    let data = Array.from(formData.keys()).reduce((result, key) => {
        let isArray = key.slice(-2) == '[]';

        if (typeof result[key] !== 'undefined') {
            return result;
        }

        if (isArray) {
            result[key] = formData.getAll(key).filter(item => item !== '');
        } else {
            result[key] = formData.get(key);

            let previewElem = document.querySelector('[data-preview="' + key + '"] [src]');
            if (previewElem) {
                let src = previewElem.getAttribute('src');
                formData.set(key, src)
                result[key] = src;
            } else {
                if (typeof result[key] === 'object' && result[key] != null) {
                    if (!result[key].name) {
                        delete result[key];
                    }
                }
            }
        }

        return result;
    }, {});

    axios({
        method: 'post',
        url: location.pathname + '/' + URLParam('url') + '/preview',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    }).then(response => {
        if (isObject(response.data)) {
            data = Object.assign(data, response.data);
        }

        let previewsElems = document.querySelectorAll('#itemsForm [data-preview]');
        previewsElems.forEach(previewsElem => {
            let name = previewsElem.getAttribute('data-preview'),
                images = previewsElem.querySelectorAll('img'),
                result = [];

            images.forEach(image => {
                result.push(image.getAttribute('src'));
            });

            if (result.length) {
                data[name] = result.length > 1 ? result : result[0];
            } else {
                data[name] = null;
            }
        });

        if (typeof userFunction === 'function') {
            userFunction(data, callback);
        } else {
            callback(data);
        }
    }).catch(() => {
        callback(data);
    });
}

const setAttr = (attrElem, data) => {
    let attr = attrElem.getAttribute('attr');

    if (attr) {
        let attrArr = attr.split(':');

        attrElem.setAttribute(attrArr[0].replace(/_/g, '-'), getDataValue(attrArr[1], data));
    }
}

const dataInHtml = (html, data) => {
    if (isObject(data)) {
        let htmlElems = html.querySelectorAll('[html]');
        htmlElems.forEach(htmlElem => {
            let value = getDataValue(htmlElem.getAttribute('html'), data);

            if (value) {
                htmlElem.innerHTML = value;

                if (htmlElem.style.display == 'none') {
                    htmlElem.style.display = 'block';
                }
            }
        });

        let attrElems = html.querySelectorAll('[attr]');
        attrElems.forEach(attrElem => {
            setAttr(attrElem, data);
        });
        setAttr(html, data);

        let issetElems = html.querySelectorAll('[isset]');
        issetElems.forEach(issetElem => {
            let value = getDataValue(issetElem.getAttribute('isset'), data);

            if (value) {
                if (issetElem.style.display == 'none') {
                    issetElem.removeAttribute('style');
                }
            } else {
                issetElem.parentNode.removeChild(issetElem);
            }
        });

        let noneElems = html.querySelectorAll('[preview-none]');
        noneElems.forEach(noneElem => {
            noneElem.parentNode.removeChild(noneElem);
        });
    }

    return html;
}

const itemsInHtml = (html, data) => {
    let ObjectKeys = Object.keys(data);

    ObjectKeys.forEach(key => {
        if (key.indexOf('[') == -1) {
            let itemsListElem = html.querySelector('[items-list-' + key + ']');

            if (itemsListElem) {
                let itemHtml = html.querySelector('[items-html-' + key + ']');

                if (itemHtml) {
                    itemHtml = itemHtml.cloneNode(true);

                    let items = data[key].map(itemData => {
                        let itemHtmlResult = dataInHtml(itemHtml, itemData);

                        itemHtmlResult.removeAttribute('style');

                        return itemHtmlResult.outerHTML;
                    });

                    itemsListElem.innerHTML = items.join('');
                }
            }
        }
    });

    return html;
}

const getUrlData = (options, callback) => {
    axios(options.html).then(response => {
        let htmlElem = document.createElement('html');

        htmlElem.innerHTML = '<div>' + response.data + '</div>';

        let selectorElem = options.selector
            ? htmlElem.querySelector(options.selector)
            : htmlElem.querySelector('body');

        getFormData(options.data, formData => {
            selectorElem = dataInHtml(selectorElem, formData);
            selectorElem = itemsInHtml(selectorElem, formData);

            let css = '';
            if (!options.css) {
                htmlElem.querySelectorAll('[rel="stylesheet"]').forEach(link => {
                    css += link.outerHTML;
                });
            }

            if (typeof options.render === 'function') {
                selectorElem = options.render(selectorElem, formData, html => {
                    callback({
                        html: html.outerHTML,
                        css: css
                    });
                });
            } else {
                callback({
                    html: selectorElem.outerHTML,
                    css: css
                });
            }
        });
    });
}

const adminedStyles = (on) => {
    let offStyles = document.querySelector('off-style');

    if (on) {
        offStyles.outerHTML = offStyles.outerHTML.replace(/off-style/g, 'style');
        document.querySelector('body').style.overflow = 'auto';
    } else if (!offStyles) {
        let styles = document.querySelector('style');
        styles.outerHTML = styles.outerHTML.replace(/style/g, 'off-style');

        setTimeout(() => {
            document.querySelector('body').style.overflow = 'hidden';
        }, 1000);
    }
}

export default ({ options, show, previewVisible }) => {
    if (!show) {
        return '';
    }

    const onPreviewHide = () => {
        adminedStyles(true);
        previewVisible(false);
    }

    const [html, setHtml] = useState();
    const [preloader, setPreloader] = useState(true);

    useEffect(() => {
        getUrlData(options, ({ html, css }) => {
            if (options.css) {
                css = '<link rel="stylesheet" href="' + options.css + '">';
            }

            adminedStyles(false);

            setHtml(css + html);

            setTimeout(() => {
                setPreloader(false);
            }, 1000)
        });
    }, []);

    return <div className="adm-preview">
        <div className="adm-content" dangerouslySetInnerHTML={{ __html: html }}></div>
        <div className="adm-actions">
            <button className="adm-btn" onClick={onPreviewHide}>Закрыть просмотр</button>
        </div>
        {
            preloader ? <div className="adm-preloader" dangerouslySetInnerHTML={{ __html: '<svg  xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="32px" height="32px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>' }}></div> : ''
        }
    </div >
}