import React from "react";

class Actions extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        if (typeof this.props.page.actions !== 'undefined') {
            let result = this.props.page.actions.map((action, i) =>
                <a
                    className="btn action-item"
                    href={action.href ? action.href : null}
                    onClick={action.onclick ? action.onclick : null}
                    target={action.target ? action.target : null}
                    key={i}
                >{action.text}</a>
            );

            result.push(<div key="divider" className="divider">|</div>);

            return result;
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
                    {this.actions()}
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
                </div>
            </div>
        );
    }

}

export default Actions;