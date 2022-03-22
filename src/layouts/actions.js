import React from "react";

class Actions extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        if (typeof this.props.page.actions !== 'undefined') {
            return this.props.page.actions.map((action, i) =>
                <>
                    {i ? null : <div className="divider">|</div>}
                    <a
                        className="btn action-item"
                        href={action.href ? action.href : null}
                        onClick={action.onclick ? action.onclick : null}
                        target={action.target ? action.target : null}
                        key={i}
                    >{action.text}</a>
                </>
            );
        }
    }

    render() {
        return (
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
                                <a className={this.props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item"} onClick={this.props.itemsDelete}>Удалить</a>
                            </>
                            : ''
                    }
                    {
                        this.props.page.config('addAction', true)
                            ? <a className="btn action-item" onClick={this.props.showForm}>Добавить</a>
                            : ''
                    }
                    {this.actions()}
                </div>
            </div>
        );
    }

}

export default Actions;