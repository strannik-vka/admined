export default (props) => {
    const selectedCount = () => {
        if (props.itemsSelected.length) {
            return <div className="selectedCount">{props.itemsSelected.length}</div>
        }
    }

    const actions = () => {
        if (typeof props.page.actions !== 'undefined') {
            let selectedCountElem = selectedCount(),
                locationSearch = '';

            if (location.search.indexOf('&') > -1) {
                locationSearch = location.search.substring(
                    location.search.indexOf('&') + 1, location.search.length
                )
            }

            if (props.itemsSelected.length) {
                locationSearch += (locationSearch ? '&' : '') + 'items=' + props.itemsSelected.join(',');
            }

            return props.page.actions.map((action, i) =>
                <a
                    className="btn action-item"
                    href={
                        action.href
                            ? action.href + (
                                locationSearch
                                    ? (action.href.indexOf('?') > -1 ? '&' : '?') + locationSearch
                                    : ''
                            )
                            : null
                    }
                    onClick={action.onclick ? action.onclick : null}
                    target={action.target ? action.target : null}
                    key={i}
                >{action.text}{action.selectedCount ? selectedCountElem : ''}</a>
            )
        }
    }

    const deleteAction = () => {
        if (props.page.config('deleteAction', true)) {
            return <a className={props.itemsSelected.length ? "btn action-item" : "btn btn-disabled action-item"} onClick={props.itemsDelete}>Удалить{selectedCount()}</a>
        }
    }

    const addAction = () => {
        if (props.page.config('addAction', true)) {
            return <a className="btn action-item" onClick={props.showForm}>Добавить</a>
        }
    }

    return <div
        className="actions"
        style={props.page.form.length ? { display: 'flex' } : { display: 'none' }}
    >
        <div className="to_total">
            Кол-во: {props.to}/{props.total}
            <span className="saveStatus">{props.saveStatus}</span>
        </div>
        <div>
            {actions()}
            {deleteAction()}
            {addAction()}
        </div>
    </div>
}