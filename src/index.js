import React from "react";
import ReactDOM from 'react-dom';
import Filter from "./components/filter";
import Header from './components/header';
import Items from './components/items';
import Form from "./components/form";
import './helpers';

import '../css/index.css';

const axios = require('axios').default;

class Admined extends React.Component {

    constructor(props) {
        super(props);

        this.ajaxItems = false;

        this.pageDefault = {
            formShow: false,
            pageNumber: 1,
            itemsSelected: [],
            editItem: {},
            page: {
                url: false,
                form: [],
                vars: {},
                filter: {}
            },
            paginate: {
                data: [],
                total: 0,
            },
            saveStatus: ''
        }

        this.state = Object.assign({
            pages: []
        }, this.pageDefault);

        document.addEventListener('scroll', this.scroll);
    }

    onFilterChange = (value, name, callback) => {
        var pageData = this.state.page;

        pageData.filter[name] = value;

        this.setState(
            Object.assign(
                this.pageDefault,
                { page: pageData }
            ), () => {
                if (callback) {
                    callback();
                }

                this.getItems();
            }
        );
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
        formData.append(name, value);

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
        var index = this.state.itemsSelected.indexOf(id);

        if (index > -1) {
            this.state.itemsSelected.splice(index, 1);
        } else {
            this.state.itemsSelected.push(id);
        }

        this.setState({
            itemsSelected: this.state.itemsSelected
        });
    }

    itemEdit(successData) {
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

    setFormShow = (val, successData) => {
        var data = {
            formShow: val
        }

        if (val == false) {
            data.editItem = {};

            this.itemEdit(successData);
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
                this.getItems();
            }
        }
    }

    changePage = (page) => {
        history.pushState(null, page.name, location.pathname + '?url=' + page.url);
        document.querySelector('title').innerHTML = page.name;

        this.setState(
            Object.assign(
                this.pageDefault,
                { page: Object.assign(this.pageDefault.page, page) }
            ), () => {
                this.getItems();
            }
        );
    }

    getItems() {
        axios.get(location.pathname + '/' + this.state.page.url, {
            params: Object.assign(this.state.page.filter, {
                page: this.state.pageNumber
            })
        }).then((response) => {
            var paginate = response.data.paginate;

            delete response.data.paginate;

            this.setState({
                paginate: {
                    data: paginate.data
                        ? [...this.state.paginate.data, ...paginate.data]
                        : this.state.paginate.data,
                    total: paginate.total,
                },
                page: Object.assign(this.pageDefault.page, { vars: response.data }),
                pageNumber: this.state.pageNumber + 1
            });

            this.ajaxItems = false;
        });
    }

    page(url, name, data) {
        data.url = url;
        data.name = name;

        this.setState((state) => {
            return {
                pages: [...state.pages, data]
            }
        }, () => {
            if (this.state.page.form.length == 0) {
                var url = currentUrl();

                if (url) {
                    if (url == data.url) {
                        this.changePage(data);
                    }
                } else {
                    this.changePage(data);
                }
            }
        });
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

        this.setState({ editItem: itemData });
        this.setFormShow(true);
    }

    render() {
        return (
            <>
                <Header
                    pages={this.state.pages}
                    page={this.state.page}
                    to={this.state.paginate.data.length}
                    total={this.state.paginate.total}
                    changePage={this.changePage}
                    itemsSelected={this.state.itemsSelected}
                    showForm={() => this.setFormShow(true)}
                    itemsDelete={this.itemsDelete}
                    saveStatus={this.state.saveStatus}
                />
                <table className="items">
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
                <Form
                    page={this.state.page}
                    show={this.state.formShow}
                    editItem={this.state.editItem}
                    onHide={(successData) => this.setFormShow(false, successData)}
                />
            </>
        );
    }

}

export default ReactDOM.render(
    <Admined />,
    document.getElementById('admined')
);