import React from "react";

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    click(e, page) {
        if (!page.href) {
            e.preventDefault();
            this.props.changePage(page, true);
        }
    }

    getMenuItems(url) {
        var result = [];

        this.props.pages.forEach(page => {
            if (url) {
                if (url != page.parent) {
                    return false;
                }
            } else if (page.parent) {
                return false;
            }

            var childrens = this.getMenuItems(page.url);

            if (childrens.length) {
                result.push(<div className="links" key={page.url + '_group'}>
                    {this.getMenuItem(page, true)}
                    <div className="childrens shadow">
                        {childrens}
                    </div>
                </div>);
            } else {
                result.push(this.getMenuItem(page));
            }
        });

        return result;
    }

    isChildrenActive(url) {
        var result = false;

        this.props.pages.forEach(page => {
            if (url == page.parent) {
                if (this.props.page.url == page.url) {
                    result = true;
                }
            }
        });

        return result;
    }

    getMenuItem(page, isParent) {
        var active = this.props.page.url == page.url;

        if (isParent && !active) {
            active = this.isChildrenActive(page.url);
        }

        return <a
            className={active ? 'active link' : 'link'}
            href={page.href ? page.href : '/admin?url=' + page.url}
            key={page.url}
            onClick={(e) => this.click(e, page)}
        >{page.name}{isParent ? <svg fill="none" height="8" viewBox="0 0 12 8" width="12" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M2.16 2.3a.75.75 0 011.05-.14L6 4.3l2.8-2.15a.75.75 0 11.9 1.19l-3.24 2.5c-.27.2-.65.2-.92 0L2.3 3.35a.75.75 0 01-.13-1.05z" fill="currentColor" clipRule="evenodd"></path></svg> : ''}</a>;
    }

    user_actions() {
        if (typeof this.props.page.actions !== 'undefined') {
            return this.props.page.actions.map((action, i) =>
                <a
                    className="btn action-item"
                    href={action.href ? action.href : 'javascript://'}
                    onClick={action.onclick ? action.onclick : ''}
                    key={i}
                >{action.text}</a>
            );
        }
    }

    render() {
        return (
            <header id="header">
                <div className="menu">{this.getMenuItems()}</div>
                <div className="actions" style={this.props.page.form.length ? { display: 'flex' } : { display: 'none' }}>
                    <div className="to_total">
                        Показано: {this.props.to} из {this.props.total}
                        <span className="saveStatus">{this.props.saveStatus}</span>
                    </div>
                    <div>
                        {
                            this.props.page.config('deleteAction', true)
                                ?
                                <>
                                    <span className="selected">Выбрано: {this.props.itemsSelected.length}</span>
                                    <button className={this.props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item"} onClick={this.props.itemsDelete}>Удалить</button>
                                </>
                                : ''
                        }
                        {
                            this.props.page.config('addAction', true)
                                ? <button className="btn action-item" onClick={this.props.showForm}>Добавить</button>
                                : ''
                        }
                        {this.user_actions()}
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;