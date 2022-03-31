import React from "react";
import ReactDOM from 'react-dom';

import Menu from "./layouts/menu";
import Actions from './layouts/actions';
import Filter from "./layouts/filter";
import Items from './layouts/items';
import Form from "./layouts/form";
import Charts from "./layouts/charts";

import './helpers';

import '../css/index.css';
import isObject from "isobject";

const axios = require('axios').default;

class Admined extends React.Component {

    constructor(props) {
        super(props);

        this.ajaxItemsRequest = null;
        this.ajaxItems = false;
        this.itemsUpdateInterval = false;
        this.pages = [];
        this.isMiddleware = false;

        this.state = {
            pages: [], ...this.pageDefault()
        };

        document.addEventListener('scroll', this.scroll);
    }

    pageDefault() {
        return {
            formShow: false,
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
        var pageData = this.state.page;

        pageData.filter[name] = value;

        this.setState({
            ...this.pageDefault(),
            ...{ page: pageData }
        }, () => {
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
        this.setState((prevState) => {
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

    setFormShow = (val) => {
        var data = {
            formShow: val
        }

        if (!val) {
            data.editItem = {};
        }

        this.setState(data);
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

    changePage = (page, reset) => {
        var params = reset ? '' : window.location.search.substring(1);
        params = params.replace('url=' + page.url, '');

        history.pushState(null, page.name, location.pathname + '?url=' + page.url + (params ? params : ''));
        document.querySelector('title').innerHTML = page.name;

        const pageDefault = this.pageDefault();

        pageDefault.page = { ...pageDefault.page, ...page };

        if (params) {
            var params_arr = params.split('&');

            params_arr.forEach(element => {
                var elem_arr = element.split('=');

                pageDefault.page.filter[elem_arr[0]] = decodeURIComponent(elem_arr[1]);
            });
        }

        this.setState(pageDefault, () => {
            this.getItems();
            this.itemsUpdateStart();
        });
    }

    itemsUpdateStart() {
        if (this.itemsUpdateInterval) {
            clearInterval(this.itemsUpdateInterval);
        }

        this.itemsUpdateInterval = setInterval(() => {
            this.itemsUpdate(() => {
                this.itemsUpdateStart();
            });
        }, 5000);
    }

    itemsUpdate(callback) {
        if (this.ajaxItemsRequest) {
            this.ajaxItemsRequest.cancel();
        }

        this.ajaxItemsRequest = axios.CancelToken.source();

        axios.get(location.pathname + '/' + this.state.page.url, {
            cancelToken: this.ajaxItemsRequest.token,
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
                        if (callback) callback();
                    })
                }
            }
        });
    }

    getItems(callback) {
        if (this.ajaxItemsRequest) {
            this.ajaxItemsRequest.cancel();
        }

        this.ajaxItemsRequest = axios.CancelToken.source();

        axios.get(location.pathname + '/' + this.state.page.url, {
            cancelToken: this.ajaxItemsRequest.token,
            params: { ...this.state.page.filter, ...{ page: this.state.pageNumber } }
        }).then((response) => {
            var isPaginate = typeof response.data.paginate !== 'undefined',
                vars = Object.assign({}, response.data);

            window.vars = vars;

            if (typeof vars.paginate !== 'undefined') {
                delete vars.paginate;
            }

            this.setState((prevState) => {
                return {
                    paginate: {
                        enabled: isPaginate,
                        data: isPaginate
                            ? [...prevState.paginate.data, ...response.data.paginate.data]
                            : prevState.paginate.data,
                        total: isPaginate ? response.data.paginate.total : 0,
                    },
                    page: { ...prevState.page, ...{ vars: vars } },
                    pageNumber: prevState.pageNumber + 1
                }
            }, () => {
                if (callback) callback();
            });
        });
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
            callback();
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
        var itemData = {};

        this.state.paginate.data.map((item) => {
            if (item.id == id) {
                itemData = item;
            }
        });

        this.setState({
            editItem: itemData,
            formShow: TextTrackCue
        });
    }

    render() {
        return (
            <>
                <header id="header">
                    <Menu
                        pages={this.state.pages}
                        page={this.state.page}
                        changePage={this.changePage}
                    />
                    <Actions
                        page={this.state.page}
                        to={this.state.paginate.data.length}
                        total={this.state.paginate.total}
                        saveStatus={this.state.saveStatus}
                        itemsSelected={this.state.itemsSelected}
                        itemsDelete={this.itemsDelete}
                        showForm={() => this.setFormShow(true)}
                    />
                </header>
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
                    show={this.state.formShow}
                    editItem={this.state.editItem}
                    itemEdit={this.itemEdit}
                    hideForm={() => this.setFormShow(false)}
                />
            </>
        );
    }

}

export default ReactDOM.render(
    <Admined />,
    document.getElementById('admined')
);