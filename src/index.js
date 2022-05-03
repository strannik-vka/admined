import React from "react";
import ReactDOM from 'react-dom';

import './helpers';

import Header from "./layouts/header";
import Filter from "./layouts/filter";
import Items from './layouts/items';
import Form from "./layouts/form";
import Charts from "./layouts/charts";
import Preview from "./layouts/preview";

import '../css/index.css';
import '../css/preview.css';

const axios = require('axios').default;

class Admined extends React.Component {

    constructor(props) {
        super(props);

        this.UpdateCancelTokenSource = axios.CancelToken.source();
        this.CancelTokenSource = axios.CancelToken.source();
        this.ajaxItems = false;
        this.itemsUpdateTimeout = false;
        this.pages = [];
        this.isMiddleware = false;

        this.state = {
            isDomRender: false,
            pages: [],
            ...this.stateDefault({})
        };

        document.addEventListener('scroll', this.scroll);
    }

    stateDefault(page) {
        return {
            previewShow: null,
            preview: page.preview ? page.preview : null,
            formIsShow: null,
            pageNumber: 1,
            itemsSelected: [],
            editItem: {},
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

            return { ...this.stateDefault(prevState.page), ...{ page: prevState.page } }
        }, () => {
            this.historyPushState();

            if (callback) {
                callback();
            }

            this.getItems();
        });
    }

    onItemChange = (id, name, value, callback) => {
        var data = {
            paginate: this.state.paginate,
            saveStatus: 'Сохранение..'
        }

        var itemIndex = false;

        data.paginate.data.map((item, index) => {
            if (item.id == id) {
                itemIndex = index;
            }
        });

        data.paginate.data[itemIndex][name] = value;

        this.setState(data, callback);

        var formData = new FormData();

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
            if (response.data.success) {
                this.setState({
                    saveStatus: 'Сохранено'
                });
            } else if (response.data.errors) {
                this.setState({
                    saveStatus: 'Ошибка: ' + response.data.errors[name][0]
                });
            }

            setTimeout(() => {
                this.setState({
                    saveStatus: ''
                });
            }, 1000);
        });
    }

    itemSelectAll = (event) => {
        var ids = [];

        if (event.target.checked) {
            this.state.paginate.data.map((item) => {
                ids.push(item.id);
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
            var data = {
                paginate: this.state.paginate
            }

            if (this.state.editItem.id == successData.id) {
                var itemIndex = false;

                data.paginate.data.map((item, index) => {
                    if (item.id == successData.id) {
                        itemIndex = index;
                    }
                });

                data.paginate.data[itemIndex] = successData;
            } else {
                data.paginate.data.unshift(successData);
                data.paginate.total++;
            }

            this.setState(data);
        }
    }

    formVisible = (val) => {
        if (this.state.formIsShow !== val) {
            let data = {
                formIsShow: val
            }

            if (!val) {
                data.editItem = {};
            }

            this.setState(data);
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
                ) < 300 && this.state.paginate.data.length < this.state.paginate.total
            ) {
                this.ajaxItems = true;
                this.getItems(() => {
                    this.ajaxItems = false;
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

        this.setState(stateDefault, () => {
            this.historyPushState();
            this.getItems();
            this.itemsUpdateStart();
        });
    }

    itemsUpdateStart() {
        if (this.itemsUpdateTimeout) {
            clearTimeout(this.itemsUpdateTimeout);
        }

        this.itemsUpdateTimeout = setTimeout(() => {
            this.itemsUpdate(() => {
                this.itemsUpdateStart();
            });
        }, 5000);
    }

    itemsUpdate(callback) {
        if (this.ajaxItems) {
            if (callback) callback();
        } else {
            this.UpdateCancelTokenSource.cancel();
            this.UpdateCancelTokenSource = axios.CancelToken.source();

            axios.get(location.pathname + '/' + this.state.page.url, {
                cancelToken: this.UpdateCancelTokenSource.token,
                params: { ...this.state.page.filter, ...{ page: 1 } }
            }).then((response) => {
                var isPaginate = typeof response.data.paginate !== 'undefined',
                    vars = Object.assign({}, response.data);

                window.vars = vars;

                if (typeof vars.paginate !== 'undefined') {
                    delete vars.paginate;
                }

                let paginateData = {
                    enabled: isPaginate,
                    total: isPaginate ? response.data.paginate.total : 0
                }

                if (isPaginate) {
                    let itemLast = this.state.paginate.data.length ? this.state.paginate.data[0] : null,
                        newItems = [];

                    if (itemLast) {
                        let prevDataIds = this.state.paginate.data.map(item => {
                            return item.id;
                        });

                        response.data.paginate.data.forEach(item => {
                            if (prevDataIds.indexOf(item.id) == -1) {
                                newItems.push(item);
                            }
                        });
                    } else {
                        newItems = response.data.paginate.data;
                    }

                    if (newItems.length) {
                        paginateData.data = [...newItems, ...this.state.paginate.data];

                        this.setState({
                            paginate: paginateData,
                            page: { ...this.state.page, ...{ vars: vars } }
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
        }
    }

    getItems(callback) {
        this.CancelTokenSource.cancel();
        this.UpdateCancelTokenSource.cancel();

        this.CancelTokenSource = axios.CancelToken.source();

        this.setState({
            saveStatus: 'Загрузка списка..'
        }, () => {
            axios.get(location.pathname + '/' + this.state.page.url, {
                cancelToken: this.CancelTokenSource.token,
                params: { ...this.state.page.filter, ...{ page: this.state.pageNumber } }
            }).then(response => {
                var isPaginate = typeof response.data.paginate !== 'undefined',
                    vars = Object.assign({}, response.data);

                window.vars = vars;

                if (typeof vars.paginate !== 'undefined') {
                    delete vars.paginate;
                }

                this.setState(prevState => {
                    return {
                        paginate: {
                            enabled: isPaginate,
                            data: isPaginate
                                ? [...prevState.paginate.data, ...response.data.paginate.data]
                                : prevState.paginate.data,
                            total: isPaginate ? response.data.paginate.total : 0,
                        },
                        page: { ...prevState.page, ...{ vars: vars } },
                        pageNumber: prevState.pageNumber + 1,
                        saveStatus: ''
                    }
                }, () => {
                    if (callback) callback();
                });
            }).catch(() => {
                this.setState({
                    saveStatus: 'Ошибка загрузки списка, попробуйте еще раз..'
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
                };

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
                let url = URLParam('url'),
                    pageData = this.state.pages.filter((pageData, index) => {
                        if (url) {
                            if (url == pageData.url) {
                                return pageData;
                            }
                        } else if (index == 0) {
                            return pageData;
                        }
                    });

                this.changePage(pageData[0]);
            });
        }, 100);
    }

    middlewarePages(callback) {
        if (this.isMiddleware) {
            axios.get(location.pathname + '/middleware').then(response => {
                let url = URLParam('url'),
                    pages = this.pages.filter(page => {
                        let access = false;

                        if (Array.isArray(page.middleware)) {
                            access = page.middleware.indexOf(response.data) > -1;
                        } else {
                            access = page.middleware === response.data;
                        }

                        if (access) {
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
                            total: this.state.paginate.total - this.state.itemsSelected.length
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
                }
            });
        }
    }

    setItemEdit = (id) => {
        axios.get(location.pathname + '/' + this.state.page.url + '/' + id + '/edit').then(response => {
            this.setState({
                editItem: response.data,
                formIsShow: true
            }, () => {
                this.itemEdit(response.data);
            });
        });
    }

    render() {
        return (
            <>
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
                                    itemsToCount={this.state.paginate.data.length}
                                    itemsSelectedCount={this.state.itemsSelected.length}
                                    itemSelectAll={this.itemSelectAll}
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
        );
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