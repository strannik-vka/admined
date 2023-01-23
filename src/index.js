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
import TableTrSlideUp from "./modules/TableTrSlideUp";
import ActiveTabsCount from "./modules/ActiveTabsCount";

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
            activeTabsCount: 1,
            isDomRender: false,
            pages: [],
            user: {
                id: null
            },
            ...this.stateDefault({})
        }

        ActiveTabsCount({
            onChange: (count) => {
                if (count != this.state.activeTabsCount) {
                    this.setState({
                        activeTabsCount: count
                    });
                }
            }
        });

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
        let items = isObject(page.items) ? page.items : {},
            isItemsCopy = typeof items.copy === 'boolean' ? items.copy : true,
            isItemsEdit = typeof items.edit === 'boolean' ? items.edit : true,
            isItemsCheckbox = false,
            softDeletes = typeof items.softDeletes === 'boolean' ? items.softDeletes : true;

        if (Array.isArray(page.actions)) {
            for (let i = 0; i < page.actions.length; i++) {
                if (page.actions[i].selectedCount) {
                    isItemsCheckbox = true;
                    break;
                }
            }
        }

        if (!isItemsCheckbox) {
            isItemsCheckbox = typeof page.deleteAction === 'boolean' ? page.deleteAction : true;
        }

        if (typeof page.editAction === 'boolean') {
            isItemsEdit = page.editAction;
        }

        if (!isItemsEdit) {
            isItemsCopy = false;
        }

        return {
            previewShow: null,
            preview: page.preview ? page.preview : null,
            formIsShow: null,
            itemsSelected: [],
            itemsSelectedCountMax: 0,
            copyItem: {},
            editItem: {},
            editorSupport: false,
            sort: {
                columns: null,
                active: {
                    name: null,
                    up: null,
                }
            },
            items: {
                copy: isItemsCopy,
                edit: isItemsEdit,
                softDeletes: softDeletes,
                checkbox: isItemsCheckbox,
                delete: typeof items.delete === 'boolean' ? items.delete : false,
                readonly: typeof items.readonly === 'boolean' ? items.readonly : false,
                displayMethod: softDeletes ? (hasStorage('displayMethod') ? storage('displayMethod') : 2) : 2,
                columns: hasStorage(page.url + 'Columns') ? storage(page.url + 'Columns') : {},
                fastEdit: hasStorage('fastEdit') ? storage('fastEdit') : true,
            },
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

    setItemColumns = (index, status) => {
        this.setState(prevState => {
            let columns = hasStorage(this.state.page.url + 'Columns')
                ? storage(this.state.page.url + 'Columns')
                : {};

            columns[index] = status;

            storage(this.state.page.url + 'Columns', columns);

            return {
                items: {
                    ...prevState.items,
                    ...{ columns: columns }
                }
            }
        });
    }

    setDisplayMethod = (type_id) => {
        this.setState(prevState => {
            storage('displayMethod', type_id);

            return {
                items: {
                    ...prevState.items,
                    ...{ displayMethod: type_id }
                }
            }
        }, () => {
            this.getItems({
                reset: true
            });
        });
    }

    fastEditToggle = (status) => {
        this.setState(prevState => {
            storage('fastEdit', status);

            return {
                items: {
                    ...prevState.items,
                    ...{ fastEdit: status }
                }
            }
        });
    }

    onSortChange = (name, up) => {
        this.setState(prevState => {
            if (prevState.sort.active.name === name && prevState.sort.active.up === up) {
                name = null;
                up = null;
            }

            return {
                sort: {
                    ...prevState.sort,
                    ...{
                        active: {
                            name: name,
                            up: up
                        }
                    }
                }
            }
        }, () => {
            this.historyPushState();
            this.getItems({
                reset: true
            });
        })
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
                if (!item.editor_user_id && !item.deleted_at) {
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

    itemDelete = (id) => {
        if (!this.state.items.softDeletes) {
            if (!confirm('Подверждаете удаление?')) {
                return false;
            }
        }

        let idArr = id == 'selected' ? this.state.itemsSelected : [id];

        if (!idArr.length) {
            return false;
        }

        this.itemsUpdateOff();

        let axiosOptions = this.state.items.softDeletes ?
            {
                method: 'get',
                url: location.pathname + '/' + this.state.page.url + '?delete_id=' + idArr.join(',')
            } : {
                method: 'post',
                url: location.pathname + '/delete',
                data: {
                    items: idArr,
                    name: this.state.page.url
                }
            }

        axios(axiosOptions)
            .then(response => {
                if (response.data.success) {
                    this.setState(prevState => {
                        let data = {
                            paginate: prevState.paginate,
                            itemsSelected: []
                        }

                        let itemsLength = Object.keys(data.paginate.data).length,
                            countModifed = 0;

                        for (let i = 0; i < itemsLength; i++) {
                            if (idArr.indexOf(data.paginate.data[i].id) > -1) {
                                data.paginate.data[i].deleted_at = new Date();

                                countModifed++;

                                if (countModifed == idArr.length) {
                                    break;
                                }
                            }
                        }

                        return data;
                    }, () => {
                        const startAnimate = (idArr, callback) => {
                            idArr.forEach((itemId, i) => {
                                let itemElem = document.querySelector('[data-item-id="' + itemId + '"]'),
                                    itemDeletedElem = document.querySelector('[data-item-deleted-id="' + itemId + '"]');

                                TableTrSlideUp(itemElem, () => {
                                    if (i == idArr.length - 1) {
                                        if (callback) {
                                            callback();
                                        }
                                    }
                                });

                                if (itemDeletedElem) {
                                    TableTrSlideUp(itemDeletedElem);
                                }
                            });
                        }

                        if (this.state.items.displayMethod === 2) {
                            let delay = this.state.items.softDeletes ? 5000 : 1000;

                            this.deleteSetTimeout = setTimeout(() => {
                                startAnimate(idArr, () => {
                                    this.setState(prevState => {
                                        let data = {
                                            paginate: prevState.paginate
                                        }

                                        data.paginate.total -= idArr.length;

                                        let itemsLength = Object.keys(data.paginate.data).length,
                                            countModifed = 0;

                                        for (let i = 0; i < itemsLength; i++) {
                                            if (idArr.indexOf(data.paginate.data[i].id) > -1) {
                                                data.paginate.data.splice(i, 1);

                                                countModifed++;

                                                if (countModifed == idArr.length) {
                                                    break;
                                                }
                                            }
                                        }

                                        return data;
                                    }, () => {
                                        this.itemsUpdateOn();
                                    });
                                });
                            }, delay);
                        } else if (this.state.items.displayMethod === 3) {
                            if (this.restoreSetTimeout) {
                                clearTimeout(this.restoreSetTimeout);
                            }

                            this.itemsUpdateOn();
                        } else {
                            this.itemsUpdateOn();
                        }
                    });
                } else {
                    alert(response.data.error ? response.data.error : 'Ошибка сервера');
                    this.itemsUpdateOn();
                }
            }).catch(() => {
                this.itemsUpdateOn();
            });
    }

    itemRestore = (id) => {
        this.itemsUpdateOff();

        axios({
            method: 'get',
            url: location.pathname + '/' + this.state.page.url + '?restore_id=' + id
        }).then(response => {
            if (response.data.success) {
                this.setState(prevState => {
                    let data = {
                        paginate: prevState.paginate
                    }

                    let itemsLength = Object.keys(data.paginate.data).length;

                    for (let i = 0; i < itemsLength; i++) {
                        if (data.paginate.data[i].id == id) {
                            data.paginate.data[i].deleted_at = null;
                            break;
                        }
                    }

                    return data;
                }, () => {
                    if (this.state.items.displayMethod === 2) {
                        if (this.deleteSetTimeout) {
                            clearTimeout(this.deleteSetTimeout);
                        }

                        this.itemsUpdateOn();
                    } else if (this.state.items.displayMethod === 3) {
                        this.restoreSetTimeout = setTimeout(() => {
                            let itemElem = document.querySelector('[data-item-id="' + id + '"]');

                            TableTrSlideUp(itemElem, () => {
                                this.setState(prevState => {
                                    let data = {
                                        paginate: prevState.paginate
                                    }

                                    data.paginate.total--;

                                    let itemsLength = Object.keys(data.paginate.data).length;

                                    for (let i = 0; i < itemsLength; i++) {
                                        if (data.paginate.data[i].id == id) {
                                            data.paginate.data.splice(i, 1);
                                            break;
                                        }
                                    }

                                    return data;
                                }, () => {
                                    this.itemsUpdateOn();
                                });
                            });
                        }, 5000);
                    } else {
                        this.itemsUpdateOn();
                    }
                });
            } else {
                alert(response.data.error ? response.data.error : 'Ошибка сервера');
                this.itemsUpdateOn();
            }
        }).catch(() => {
            this.itemsUpdateOn();
        });;
    }

    itemCopy = (id) => {
        axios.get(location.pathname + '/' + this.state.page.url + '/' + id + '/edit')
            .then(response => {
                if (response.data.id) {
                    this.setState({
                        copyItem: response.data,
                        formIsShow: true
                    }, () => {
                        this.itemEdit(response.data);
                    });
                }
            });
    }

    formVisible = (status) => {
        if (this.state.formIsShow !== status) {
            let data = {
                formIsShow: status
            }

            if (status == false) {
                data.editItem = {};
                data.copyItem = {};

                this.setEditStatus('delete', () => {
                    this.setState(data, () => {
                        this.historyPushState();
                    });
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

        if (this.state.sort.active.name) {
            urlParams.push((this.state.sort.active.up ? 'sortAsc' : 'sortDesc') + '=' + this.state.sort.active.name);
        }

        if (this.state.editItem.id) {
            urlParams.push('edit_item_id=' + this.state.editItem.id);
        }

        let url = location.pathname + '?url=' + this.state.page.url;

        if (urlParams.length) {
            url += '&' + urlParams.join('&');
        }

        history.pushState(null, this.state.page.name, url);
    }

    changePage = (page, reset) => {
        document.querySelector('title').innerHTML = page.name;

        const stateDefault = this.stateDefault(page);

        stateDefault.page = { ...stateDefault.page, ...page };

        let editItemId = null

        if (!reset) {
            let urlParams = window.location.search.substring(1);

            if (urlParams) {
                urlParams = urlParams.split('&');

                urlParams.forEach(urlParam => {
                    let urlParamArr = urlParam.split('=');

                    if (
                        urlParamArr[0] != 'url' &&
                        urlParamArr[0] &&
                        urlParamArr[1]
                    ) {
                        if (['sortAsc', 'sortDesc'].indexOf(urlParamArr[0]) > -1) {
                            stateDefault.sort.active.name = urlParamArr[1];
                            stateDefault.sort.active.up = urlParamArr[0] == 'sortAsc';
                        } if (urlParamArr[0] == 'edit_item_id') {
                            editItemId = urlParamArr[1];
                        } else {
                            stateDefault.page.filter[urlParamArr[0]] = decodeURIComponent(urlParamArr[1]);
                        }
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
            this.getItems({
                callback: () => {
                    if (editItemId) {
                        this.setItemEdit(editItemId);
                    }

                    this.itemsUpdateStart();
                }
            });
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

    itemsUpdateOn() {
        this.itemsUpdateAllow = true;
    }

    itemsUpdateOff() {
        this.UpdateCancelTokenSource.cancel();
        this.itemsUpdateAllow = false;
    }

    itemsUpdate(callback) {
        this.itemsUpdateSupport(updateSupport => {
            this.UpdateCancelTokenSource.cancel();
            this.UpdateCancelTokenSource = axios.CancelToken.source();

            VisibleItems({
                selector: '[data-item-id]',
                attr: 'data-item-id'
            }, items => {
                let params = this.getItemsParams(),
                    isTop = true,
                    url = location.pathname + '/' + this.state.page.url;

                if (items.length) {
                    if (this.state.paginate.data.length) {
                        if (items.indexOf(this.state.paginate.data[0].id) == -1) {
                            params.items = items;
                            isTop = false;
                        }
                    }
                }

                axios.get(url, {
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

                        if (newItems.length || removeItems.length || updateItems.length || response.data.dateForcedDelete) {
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

                                let newState = {
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

                                let softDeletes = true,
                                    itemKeys = Object.keys(response.data.paginate.data);

                                if (itemKeys.length) {
                                    let firstItem = response.data.paginate.data[itemKeys[0]];
                                    softDeletes = typeof firstItem.deleted_at !== 'undefined';
                                }

                                newState.items = {
                                    ...prevState.items,
                                    ...{
                                        softDeletes: softDeletes,
                                        dateForcedDelete: response.data.dateForcedDelete
                                    }
                                }

                                return newState;
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
            if (!item.editor_user_id && !item.deleted_at) {
                result++;
            }
        });

        return result;
    }

    getItemsParams() {
        let params = Object.assign({}, this.state.page.filter);

        if (this.state.items.displayMethod === 2) {
            params.withTrashed = 0;
        }

        if (this.state.items.displayMethod === 3) {
            params.onlyTrashed = 1;
        }

        if (this.state.sort.active.name) {
            params[this.state.sort.active.up ? 'sortAsc' : 'sortDesc'] = this.state.sort.active.name;
        }

        return params;
    }

    getItems({ callback, next_page_url, reset }) {
        this.CancelTokenSource.cancel();
        this.UpdateCancelTokenSource.cancel();

        this.CancelTokenSource = axios.CancelToken.source();

        this.setState({
            saveStatus: '<svg class="SVGpreloader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="16px" height="16px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#000000"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>'
        }, () => {
            let url = location.pathname + '/' + this.state.page.url,
                params = this.getItemsParams();

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
                params: params
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

                    let softDeletes = true,
                        itemKeys = Object.keys(response.data.paginate.data);

                    if (itemKeys.length) {
                        let firstItem = response.data.paginate.data[itemKeys[0]];
                        softDeletes = typeof firstItem.deleted_at !== 'undefined';
                    }

                    newState.items = {
                        ...prevState.items,
                        ...{
                            softDeletes: softDeletes,
                            dateForcedDelete: response.data.dateForcedDelete,
                        }
                    }

                    if (typeof response.data.sort !== 'undefined') {
                        newState.sort = {
                            ...prevState.sort,
                            ...{
                                columns: response.data.sort
                            }
                        }
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
                            } else {
                                if (isObject(data.items)) {
                                    if (data.items.readonly) {
                                        fields[index].readonly = true;
                                    }
                                }
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
                        if (response.data.id) {
                            this.setState({
                                editItem: response.data,
                                formIsShow: true
                            }, () => {
                                this.itemEdit(response.data);
                                this.historyPushState();
                            });
                        } else {
                            this.historyPushState();
                        }
                    });
            } else {
                alert(error);
            }
        });
    }

    getShowItemsCount(count) {
        if (this.state.items.softDeletes) {
            if (this.state.items.displayMethod === 2) {
                for (let i = 0; i < this.state.paginate.data.length; i++) {
                    if (this.state.paginate.data[i].deleted_at) {
                        count--;
                    }
                }
            }
        }

        return count;
    }

    render() {
        return <>
            <Header
                isDomRender={this.state.isDomRender}
                pages={this.state.pages}
                page={this.state.page}
                changePage={this.changePage}
                to={this.getShowItemsCount(this.state.paginate.data.length)}
                total={this.state.paginate.total}
                saveStatus={this.state.saveStatus}
                itemsSelected={this.state.itemsSelected}
                formVisible={this.formVisible}
                user={this.state.user}
                items={this.state.items}
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
                                items={this.state.items}
                                itemDelete={this.itemDelete}
                                setDisplayMethod={this.setDisplayMethod}
                                setItemColumns={this.setItemColumns}
                                fastEditToggle={this.fastEditToggle}
                                onSortChange={this.onSortChange}
                                sort={this.state.sort}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        <Items
                            itemsSelected={this.state.itemsSelected}
                            setItemEdit={this.setItemEdit}
                            itemDelete={this.itemDelete}
                            itemRestore={this.itemRestore}
                            itemCopy={this.itemCopy}
                            page={this.state.page}
                            paginate={this.state.paginate}
                            itemSelect={this.itemSelect}
                            onItemChange={this.onItemChange}
                            items={this.state.items}
                            activeTabsCount={this.state.activeTabsCount}
                            user={this.state.user}
                        />
                    </tbody>
                </table>
            </div>
            <Form
                page={this.state.page}
                show={this.state.formIsShow}
                editItem={this.state.editItem}
                copyItem={this.state.copyItem}
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