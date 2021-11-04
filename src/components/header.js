import React from "react";

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    click(e, page) {
        if (!page.href) {
            e.preventDefault();
            this.props.changePage(page);
        }
    }

    links() {
        return this.props.pages.map((page) =>
            <a
                className={this.props.page.url == page.url ? 'active link' : 'link'}
                href={page.href ? page.href : '/admin?url=' + page.url}
                key={page.url}
                onClick={(e) => this.click(e, page)}
            >
                {page.name}
            </a>
        );
    }

    render() {
        return (
            <header id="header">
                <div className="menu">{this.links()}</div>
                <div className="actions" style={this.props.page.form.length ? { display: 'table' } : { display: 'none' }}>
                    <div className="to_total">
                        Показано: {this.props.to} из {this.props.total}
                        <span className="saveStatus">{this.props.saveStatus}</span>
                    </div>
                    <div>
                        <span className="selected">
                            Выбрано: {this.props.itemsSelected.length}
                        </span>
                        <button className={this.props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item"} onClick={this.props.itemsDelete}>Удалить</button>
                        <button className="btn action-item" onClick={this.props.showForm}>Добавить</button>
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;