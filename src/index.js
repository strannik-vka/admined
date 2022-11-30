import React from "react";
import ReactDOM from 'react-dom';

import './helpers';

import Header from "./layouts/header";
import Filter from "./layouts/filter";
import Items from './layouts/items';
import Form from "./layouts/form";
import Charts from "./layouts/charts";
import Preview from "./layouts/preview";
import ClientActivity from "./modules/ClientActivity";
import VisibleItems from "./modules/VisibleItems";

import '../css/index.css';
import '../css/preview.css';

const axios = require('axios').default;

class Admined extends React.Component {

    constructor(props) {
        super(props);

        this.UpdateCancelTokenSource = axios.CancelToken.source();
        this.CancelTokenSource = axios.CancelToken.source();
        this.ajaxItems = false;
        this.itemsUpdateAllow = true;
        this.itemsUpdateTimeout = false;
        this.pages = [];
        this.isMiddleware = false;
        this.lastFastEdit = {};
        this.itemsUpdateSupports = {};

        this.state = {
            isDomRender: false,
            pages: [],
            ...this.stateDefault({})
        }

        this.getUserInfo();

        document.addEventListener('scroll', this.scroll);

        ClientActivity({
            timeOnPause: 600000,   // 10 мин.
            delayOnActive: 300000, // 5 мин.
            onActive: () => {
                if (this.state.editItem.id) {
                    this.setEditStatus(this.state.editItem.id);
                }
            },
            onPause: () => {
                this.itemsUpdateAllow = false;
            },
            onStop: () => {
                this.setEditStatus('delete');
            },
            onStopScroll: () => {
                this.itemsUpdate(() => {
                    this.itemsUpdateStart();
                });
            },
            onPlay: () => {
                this.itemsUpdateAllow = true;

                if (this.state.editItem.id) {
                    this.setEditStatus(this.state.editItem.id, ({ error }) => {
                        if (error) {
                            this.formVisible(false);
                            alert(error);
                        }
                    });
                }
            }
        });
    }

    getUserInfo() {
        axios.get(location.pathname + '/user_info').then(response => {
            if (isObject(response.data)) {
                this.setState({
                    user: response.data
                })
            }
        }).catch(() => {
            console.log('По пути: ' + location.pathname + '/user_info нет информации о юзере: {name: "ФИО"}');
        });
    }

    stateDefault(page) {
        return {
            previewShow: null,
            preview: page.preview ? page.preview : null,
            formIsShow: null,
            itemsSelected: [],
            itemsSelectedCountMax: 0,
            editItem: {},
            editorSupport: false,
            page: {
                url: false,
                form: [],
                vars: {},
                filter: {},
                config: function (name, _default) {
                    var result = typeof _default !== 'undefined' ? _default : null;

                    if (typeof this[name] !== 'undefined') {
                        result = this[name];
                    }

                    return result;
                }
            },
            paginate: {
                next_page_url: null,
                prev_page_url: null,
                data: [],
                total: 0,
            },
            saveStatus: ''
        }
    }

    onFilterChange = (value, name, callback) => {
        this.setState(prevState => {
            if (value !== '') {
                prevState.page.filter[name] = value;
            } else if (typeof prevState.page.filter[name] !== 'undefined') {
                delete prevState.page.filter[name];
            }

            return prevState;
        }, () => {
            this.historyPushState();

            if (callback) {
                callback();
            }

            this.getItems({
                reset: true
            });
        });
    }

    onItemChange = (id, name, value, callback) => {
        this.setState(prevState => {
            let itemIndex = false;

            for (let i = 0; i < prevState.paginate.data.length; i++) {
                if (prevState.paginate.data[i].id == id) {
                    itemIndex = i;
                    break;
                }
            }

            prevState.paginate.data[itemIndex][name] = value;

            this.lastFastEdit[id] = { name: name, value: value };

            return {
                paginate: prevState.paginate,
                saveStatus: '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>'
            }
        }, callback);

        let formData = new FormData();

        formData.append('_method', 'PUT');

        if (Array.isArray(value)) {
            value.forEach(item => {
                formData.append(name, item);
            });
        } else {
            formData.append(name, value);
        }

        axios({
            method: 'post',
            url: location.pathname + '/' + this.state.page.url + '/' + id,
            data: formData,
            processData: false,
            contentType: false,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            let statusText = '';

            if (response.data.success) {
                statusText = 'Сохранено';
            } else if (response.data.errors) {
                statusText = 'Ошибка: ' + response.data.errors[name][0];
            } else if (response.data.error) {
                statusText = 'Ошибка: ' + response.data.error;
            }

            this.setState({
                saveStatus: statusText
            });

            setTimeout(() => {
                this.setState({
                    saveStatus: ''
                });
            }, 1000);
        });
    }

    itemsSelectAll = (event) => {
        var ids = [];

        if (event.target.checked) {
            this.state.paginate.data.forEach(item => {
                if (!item.editor_user_id) {
                    ids.push(item.id);
                }
            });
        }

        this.setState({
            itemsSelected: ids
        });
    }

    itemSelect = (id) => {
        this.setState(prevState => {
            var index = prevState.itemsSelected.indexOf(id);

            if (index > -1) {
                prevState.itemsSelected.splice(index, 1);
            } else {
                prevState.itemsSelected.push(id);
            }

            return {
                itemsSelected: prevState.itemsSelected
            }
        });
    }

    itemEdit = (successData) => {
        if (successData && successData.id) {
            this.setState(prevState => {
                var data = {
                    paginate: prevState.paginate
                }

                var itemIndex = false;

                data.paginate.data.forEach((item, index) => {
                    if (item.id == successData.id) {
                        itemIndex = index;
                    }
                });

                if (itemIndex !== false) {
                    data.paginate.data[itemIndex] = successData;
                } else {
                    data.paginate.data.unshift(successData);
                    data.paginate.total++;
                }

                return data;
            })
        }
    }

    formVisible = (status) => {
        if (this.state.formIsShow !== status) {
            let data = {
                formIsShow: status
            }

            if (status == false) {
                data.editItem = {};

                this.setEditStatus('delete', () => {
                    this.setState(data);
                });
            } else {
                this.setState(data);
            }
        }
    }

    previewVisible = (val) => {
        if (this.state.previewIsShow !== val) {
            this.setState({
                previewIsShow: val
            });
        }
    }

    scroll = (e) => {
        if (this.ajaxItems == false) {
            if (
                (
                    e.target.documentElement.scrollHeight - (
                        e.target.documentElement.scrollTop + window.innerHeight
                    )
                ) < 300 && this.state.paginate.next_page_url
            ) {
                this.ajaxItems = true;
                this.getItems({
                    callback: () => {
                        this.ajaxItems = false;
                    },
                    next_page_url: this.state.paginate.next_page_url
                });
            }
        }
    }

    historyPushState = () => {
        let urlParams = [],
            filterKeys = Object.keys(this.state.page.filter);

        filterKeys.forEach(filterKey => {
            urlParams.push(filterKey + '=' + this.state.page.filter[filterKey]);
        });

        urlParams = urlParams.join('&');

        history.pushState(null, this.state.page.name, location.pathname + '?url=' + this.state.page.url + (urlParams ? '&' + urlParams : ''));
    }

    changePage = (page, reset) => {
        document.querySelector('title').innerHTML = page.name;

        const stateDefault = this.stateDefault(page);

        stateDefault.page = { ...stateDefault.page, ...page };

        if (!reset) {
            let urlParams = window.location.search.substring(1);

            if (urlParams) {
                urlParams = urlParams.split('&');

                urlParams.forEach(urlParam => {
                    var urlParamArr = urlParam.split('=');

                    if (urlParamArr[0] != 'url' && urlParamArr[0] && urlParamArr[1]) {
                        stateDefault.page.filter[urlParamArr[0]] = decodeURIComponent(urlParamArr[1]);
                    }
                });
            }
        }

        if (this.state.isDomRender == false) {
            stateDefault.isDomRender = true;
        }

        this.lastFastEdit = {};

        this.setState(stateDefault, () => {
            this.historyPushState();
            this.getItems({});
            this.itemsUpdateStart();
        });
    }

    itemsUpdateStart() {
        if (this.itemsUpdateTimeout) {
            clearTimeout(this.itemsUpdateTimeout);
        }

        this.itemsUpdateTimeout = setTimeout(() => {
            if (this.ajaxItems || this.itemsUpdateAllow == false) {
                this.itemsUpdateStart();
            } else {
                this.itemsUpdate(() => {
                    this.itemsUpdateStart();
                });
            }
        }, 5000);
    }

    itemsUpdateSupport(callback) {
        if (
            typeof this.itemsUpdateSupports[location.pathname] !== 'undefined' &&
            this.itemsUpdateSupports[location.pathname] !== null
        ) {
            callback(this.itemsUpdateSupports[location.pathname]);
        } else {
            const result = (status) => {
                this.itemsUpdateSupports[location.pathname] = status;
                callback(status);
            }

            if (this.state.paginate.data.length) {
                let lastItem = this.state.paginate.data[this.state.paginate.data.length - 1];

                axios.get(location.pathname + '/' + this.state.page.url, {
                    params: {
                        items: [lastItem.id]
                    }
                }).then(response => {
                    if (response.data.paginate.data.length == 1) {
                        result(response.data.paginate.data[0].id == lastItem.id);
                    } else {
                        result(false);
                    }
                }).catch(() => {
                    result(false);
                });
            } else {
                result(null);
            }
        }
    }

    itemsUpdate(callback) {
        this.itemsUpdateSupport(updateSupport => {
            this.UpdateCancelTokenSource.cancel();
            this.UpdateCancelTokenSource = axios.CancelToken.source();

            VisibleItems({
                selector: '[data-item-id]',
                attr: 'data-item-id'
            }, items => {
                let params = Object.assign({}, this.state.page.filter),
                    isTop = true;

                if (items.length) {
                    if (this.state.paginate.data.length) {
                        if (items.indexOf(this.state.paginate.data[0].id) == -1) {
                            params.items = items;
                            isTop = false;
                        }
                    }
                }

                axios.get(location.pathname + '/' + this.state.page.url, {
                    cancelToken: this.UpdateCancelTokenSource.token,
                    params: params
                }).then(response => {
                    window.vars = Object.assign({}, response.data);

                    if (typeof response.data.paginate !== 'undefined') {
                        let newItems = [],
                            removeItems = [],
                            updateItems = [],
                            responseItemsIds = [],
                            prevItemsIds = this.state.paginate.data.map(item => {
                                return item.id;
                            });

                        response.data.paginate.data.forEach(item => {
                            if (prevItemsIds.indexOf(item.id) == -1) {
                                newItems.push({
                                    data: item,
                                    prevId: responseItemsIds.length
                                        ? responseItemsIds[responseItemsIds.length - 1]
                                        : null
                                });
                            }

                            if (this.lastFastEdit[item.id]) {
                                item[this.lastFastEdit[item.id].name] = this.lastFastEdit[item.id].value;
                                delete this.lastFastEdit[item.id];
                            }

                            updateItems[item.id] = item;

                            responseItemsIds.push(item.id);
                        });

                        if (updateSupport) {
                            for (let i = 0; i < items.length; i++) {
                                if (response.data.paginate.per_page) {
                                    if (i == (response.data.paginate.per_page - 1)) {
                                        break;
                                    }
                                }

                                if (responseItemsIds.indexOf(items[i]) == -1) {
                                    removeItems.push(items[i]);
                                }
                            }
                        }

                        if (newItems.length || removeItems.length || updateItems.length) {
                            if (typeof vars.paginate !== 'undefined') {
                                delete vars.paginate;
                            }

                            this.setState(prevState => {
                                let prevData = prevState.paginate.data,
                                    itemsSelected = prevState.itemsSelected,
                                    prevTotal = prevState.paginate.total;

                                if (removeItems.length) {
                                    prevData = prevData.filter(item => removeItems.indexOf(item.id) == -1);
                                    itemsSelected = itemsSelected.filter(itemId => removeItems.indexOf(itemId) == -1);
                                    prevTotal -= removeItems.length;
                                }

                                if (updateItems.length) {
                                    prevData = prevData.map(item => {
                                        if (typeof updateItems[item.id] === 'object' && updateItems[item.id] != null) {
                                            item = updateItems[item.id];
                                        }

                                        return item;
                                    })
                                }

                                if (newItems.length) {
                                    prevTotal += newItems.length;

                                    newItems.forEach(item => {
                                        if (item.prevId) {
                                            let isSplice = false;

                                            for (let i = 0; i < prevData.length; i++) {
                                                if (prevData[i].id == item.prevId) {
                                                    prevData.splice(i + 1, 0, item.data);
                                                    isSplice = true;
                                                    break;
                                                }
                                            }

                                            if (isSplice == false) {
                                                prevData.unshift(item.data);
                                            }
                                        } else {
                                            prevData.unshift(item.data);
                                        }
                                    });
                                }

                                return {
                                    paginate: {
                                        data: prevData,
                                        total: isTop ? response.data.paginate.total : prevTotal,
                                        next_page_url: isTop ? prevState.paginate.next_page_url : prevState.paginate.next_page_url,
                                        prev_page_url: isTop ? prevState.paginate.prev_page_url : prevState.paginate.prev_page_url
                                    },
                                    itemsSelected: itemsSelected,
                                    editorSupport: this.getEditorSupport(prevData),
                                    itemsSelectedCountMax: this.getItemsSelectedCountMax(prevData),
                                    page: { ...prevState.page, ...{ vars: vars } }
                                }
                            }, () => {
                                callback();
                            })
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }).catch(() => {
                    callback();
                });
            });
        });
    }

    getEditorSupport(items) {
        return items.length ? typeof items[0].editor_user_id !== 'undefined' : false;
    }

    getItemsSelectedCountMax(items) {
        let result = 0;

        items.forEach(item => {
            if (!item.editor_user_id) {
                result++;
            }
        });

        return result;
    }

    getItems({ callback, next_page_url, reset }) {
        this.CancelTokenSource.cancel();
        this.UpdateCancelTokenSource.cancel();

        this.CancelTokenSource = axios.CancelToken.source();

        this.setState({
            saveStatus: '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>'
        }, () => {
            let url = location.pathname + '/' + this.state.page.url;

            if (next_page_url) {
                url = next_page_url;

                if (url.indexOf(location.pathname) == -1) {
                    url = location.pathname + '/' + this.state.page.url + url;
                }

                if (url.indexOf('/?') > -1) {
                    url = url.replace('/?', '?');
                }
            }

            axios.get(url, {
                cancelToken: this.CancelTokenSource.token,
                params: this.state.page.filter
            }).then(response => {
                var isPaginate = typeof response.data.paginate !== 'undefined',
                    vars = Object.assign({}, response.data);

                window.vars = vars;

                if (typeof vars.paginate !== 'undefined') {
                    delete vars.paginate;
                }

                this.setState(prevState => {
                    let newState = {
                        paginate: {
                            data: isPaginate
                                ? [...prevState.paginate.data, ...response.data.paginate.data]
                                : prevState.paginate.data,
                            total: isPaginate ? response.data.paginate.total : 0,
                            next_page_url: isPaginate
                                ? response.data.paginate.next_page_url
                                : prevState.paginate.next_page_url,
                            prev_page_url: isPaginate
                                ? response.data.paginate.prev_page_url
                                : prevState.paginate.prev_page_url,
                        },
                        page: { ...prevState.page, ...{ vars: vars } },
                        saveStatus: ''
                    }

                    newState.editorSupport = this.getEditorSupport(newState.paginate.data);
                    newState.itemsSelectedCountMax = this.getItemsSelectedCountMax(newState.paginate.data);

                    if (reset) {
                        newState.paginate.data = response.data.paginate.data;
                        newState.paginate.next_page_url = response.data.paginate.next_page_url;
                        newState.paginate.prev_page_url = response.data.paginate.prev_page_url;

                        newState = {
                            ...this.stateDefault(prevState.page),
                            ...newState
                        }
                    }

                    return newState;
                }, () => {
                    if (callback) callback();
                });
            }).catch(() => {
                this.setState(prevState => {
                    let newState = {
                        saveStatus: 'Ошибка загрузки списка, попробуйте еще раз..'
                    }

                    if (reset) {
                        newState = {
                            ...this.stateDefault(prevState.page),
                            ...newState
                        }

                        newState.page = prevState.page;
                    }

                    return newState;
                }, () => {
                    if (callback) callback();
                });
            });
        })
    }

    page(url, name, data) {
        data = typeof data === 'object' && data != null ? data : {};

        data.url = url;
        data.name = name;

        if (isObject(data)) {
            if (Array.isArray(data.form)) {
                const setDefaultProps = (fields) => {
                    for (let index = 0; index < fields.length; index++) {
                        if (fields[index]) {
                            fields[index].filter = typeof fields[index].filter !== 'undefined'
                                ? fields[index].filter : true;

                            if (fields[index].type === undefined) {
                                fields[index].type = 'string';
                            } else {
                                if (['array', 'constructor'].indexOf(fields[index].type) > -1) {
                                    fields[index].filter = false;
                                }

                                if (fields[index].type == 'constructor') {
                                    fields[index].type = '_constructor';
                                }
                            }

                            if (Array.isArray(fields[index].fields)) {
                                fields[index].fields = setDefaultProps(fields[index].fields);
                            }
                        }
                    }

                    return fields;
                }

                data.form = setDefaultProps(data.form);
            }
        }

        this.pages = [...this.pages, data];

        if (typeof data.middleware !== 'undefined') {
            this.isMiddleware = true;
        }

        if (this.changePageTimer) {
            clearTimeout(this.changePageTimer);
        }

        this.changePageTimer = setTimeout(() => {
            this.middlewarePages(() => {
                if (this.state.pages.length) {
                    let url = URLParam('url'),
                        pageData = null;

                    if (url) {
                        for (let i = 0; i < this.state.pages.length; i++) {
                            if (url == this.state.pages[i].url) {
                                pageData = this.state.pages[i];
                                break;
                            }
                        }
                    } else {
                        pageData = this.state.pages[0];
                    }

                    this.changePage(pageData);
                }
            });
        }, 100);
    }

    middlewarePages(callback) {
        if (this.isMiddleware) {
            axios.get(location.pathname + '/middleware').then(response => {
                if (response.data) {
                    let url = URLParam('url'),
                        pages = this.pages.filter(page => {
                            let access = false;

                            if (Array.isArray(page.middleware)) {
                                access = page.middleware.indexOf(response.data) > -1;
                            } else {
                                access = page.middleware === response.data;
                            }

                            if (access) {
                                if (Array.isArray(page.form)) {
                                    page.form = page.form.filter(field => {
                                        if (field.middleware) {
                                            let fieldMiddlewares = Array.isArray(field.middleware)
                                                ? field.middleware : [field.middleware];

                                            if (fieldMiddlewares.indexOf(response.data) > -1) {
                                                return field;
                                            }
                                        } else {
                                            return field;
                                        }
                                    })
                                }

                                return page;
                            } else {
                                if (page.url == url) {
                                    history.pushState(null, page.name, location.pathname);
                                }
                            }
                        });

                    this.setState({
                        pages: pages
                    }, () => {
                        callback();
                    });
                } else {
                    this.setState({
                        pages: this.pages
                    }, () => {
                        callback();
                    });
                }
            });
        } else {
            this.setState({
                pages: this.pages
            }, () => {
                callback();
            });
        }
    }

    itemsDelete = () => {
        if (this.state.itemsSelected.length) {
            if (!confirm('Уверены, что хотите удалить?')) return false;

            axios({
                method: 'post',
                url: location.pathname + '/delete',
                data: {
                    items: this.state.itemsSelected,
                    name: this.state.page.url
                }
            }).then((response) => {
                if (response.data.success) {
                    var data = {
                        paginate: {
                            data: this.state.paginate.data,
                            total: this.state.paginate.total - this.state.itemsSelected.length,
                            next_page_url: this.state.paginate.next_page_url,
                            prev_page_url: this.state.paginate.prev_page_url,
                        },
                        itemsSelected: []
                    }

                    var indexes = [];

                    data.paginate.data.map((item, index) => {
                        if (this.state.itemsSelected.indexOf(item.id) > -1) {
                            indexes.push(index);
                        }
                    });

                    indexes = indexes.reverse();

                    indexes.map((index) => {
                        data.paginate.data.splice(index, 1);
                    });

                    this.setState(data);
                } else {
                    if(response.data.error) {
                        alert(response.data.error);
                    }
                }
            });
        }
    }

    setEditStatus = (id, callback) => {
        if (this.state.editorSupport) {
            axios.get(location.pathname + '/' + this.state.page.url + '?editor_item_id=' + id)
                .then(response => {
                    if (callback && id != 'delete') {
                        callback(response.data);
                    }
                });

            if (id == 'delete' && callback) {
                if (this.state.editItem.id) {
                    this.setState(prevState => {
                        let paginateData = prevState.paginate;

                        paginateData.data = prevState.paginate.data.map(item => {
                            if (item.id == this.state.editItem.id) {
                                item.editor_user_id = null;
                                item.editor_user = null;
                            }

                            return item;
                        })

                        return {
                            paginate: paginateData
                        }
                    }, () => {
                        callback();
                    });
                } else {
                    callback();
                }
            }
        } else {
            if (callback) {
                callback({
                    success: true
                });
            }
        }
    }

    setItemEdit = (id) => {
        this.setEditStatus(id, ({ success, error }) => {
            if (success || typeof error === 'undefined') {
                axios.get(location.pathname + '/' + this.state.page.url + '/' + id + '/edit')
                    .then(response => {
                        this.setState({
                            editItem: response.data,
                            formIsShow: true
                        }, () => {
                            this.itemEdit(response.data);
                        });
                    });
            } else {
                alert(error);
            }
        });
    }

    render() {
        return <>
            <Header
                isDomRender={this.state.isDomRender}
                pages={this.state.pages}
                page={this.state.page}
                changePage={this.changePage}
                to={this.state.paginate.data.length}
                total={this.state.paginate.total}
                saveStatus={this.state.saveStatus}
                itemsSelected={this.state.itemsSelected}
                itemsDelete={this.itemsDelete}
                formVisible={this.formVisible}
                user={this.state.user}
            />
            <div className="content">
                <Charts
                    page={this.state.page}
                />
                <table
                    className="items"
                    style={this.state.page.form.length ? { display: 'table' } : { display: 'none' }}
                >
                    <thead className="form-reverse">
                        <tr>
                            <Filter
                                itemsSelectedCountMax={this.state.itemsSelectedCountMax}
                                itemsSelectedCount={this.state.itemsSelected.length}
                                itemsSelectAll={this.itemsSelectAll}
                                onChange={this.onFilterChange}
                                page={this.state.page}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        <Items
                            itemsSelected={this.state.itemsSelected}
                            setItemEdit={this.setItemEdit}
                            page={this.state.page}
                            paginate={this.state.paginate}
                            itemSelect={this.itemSelect}
                            onItemChange={this.onItemChange}
                        />
                    </tbody>
                </table>
            </div>
            <Form
                page={this.state.page}
                show={this.state.formIsShow}
                editItem={this.state.editItem}
                itemEdit={this.itemEdit}
                formVisible={this.formVisible}
                isPreview={isObject(this.state.preview)}
                previewVisible={this.previewVisible}
            />
            <Preview
                show={this.state.previewIsShow}
                options={this.state.preview}
                previewVisible={this.previewVisible}
            />
        </>
    }

}

const AdminedDOM = ReactDOM.render(
    <Admined />,
    document.getElementById('admined')
)

window.Admined = {
    page: (...args) => {
        AdminedDOM.page(...args);
    }
}