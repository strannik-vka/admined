import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DivInput from "../components/divInput";
import Checkbox from "../components/checkbox";
import Switch from "../components/switch";
import Select from "../components/select";
import ViewportList from "react-viewport-list";
import { dateFormat } from "../../shared/lib/DateFormat";
import { isImage } from "../../shared/lib/URLType";
import { imageUrl } from "../../shared/lib/ImageUrl";
import { getDataValue } from "../../shared/lib/GetDataValue";

class Items extends React.Component {

    constructor(props) {
        super(props);
    }

    switch(item, input) {
        return (
            <Switch
                readonly={input.readonly}
                name={input.name}
                checked={item[input.name]}
                placeholder={input.placeholder}
                onChange={(value) => this.props.onItemChange(item.id, input.name, value)}
                value="1"
            />
        );
    }

    getOptions(item, input) {
        let options = [],
            nameWith = input.name.replace('_id', '');

        if (Array.isArray(this.props.page.vars[input.name.replace('_id', '').replace('[]', '')])) {
            options = Array.from(this.props.page.vars[input.name.replace('_id', '').replace('[]', '')]);
        }

        if (item[nameWith]) {
            let option = item[nameWith];

            if (JSON.stringify(options).indexOf('"id":' + option.id + ',') === -1) {
                options.unshift(option);
            }
        }

        return options;
    }

    select(item, input) {
        let options = this.getOptions(item, input);

        return (
            <Select
                readonly={input.readonly}
                name={input.name}
                value={item[input.name.replace('[]', '')]}
                options={options}
                text_key={input.text_key}
                defaultOption={input.defaultOption}
                onChange={(value) => this.props.onItemChange(item.id, input.name, value)}
                url={input.url}
            />
        );
    }

    with(input, item) {
        return typeof input.with !== 'undefined'
            ? getDataValue(input.with, item)
            : item[input.name.replace('_id', '')];
    }

    getName(str) {
        var str = str.split('[');

        return str[0];
    }

    file(item, input) {
        var name = this.getName(input.name);

        if (typeof item[name] === 'object' && item[name] != null) {
            return item[name].length ? item[name].map((url, i) => {
                return <a key={i} className="d-block" href={url} target="_blank">Скачать&nbsp;файл</a>;
            }) : '—';
        } else if (isImage(item[name])) {
            return <a href={item[name]} target="_blank">
                <img
                    src={imageUrl(item[name], input.thumb)}
                    className="image"
                />
            </a>;
        } else {
            return item[name] ? <a href={item[name]} target="_blank">Скачать&nbsp;файл</a> : '—';
        }
    }

    string(item, input) {
        let value = item[input.name],
            values = [];

        if (input.type == 'select') {
            let options = this.getOptions(item, input);

            for (let i = 0; i < options.length; i++) {
                if (Array.isArray(value)) {
                    if (value.indexOf('' + options[i].id + '') > -1 || value.indexOf(options[i].id) > -1) {
                        values.push(options[i].name);
                    }
                } else {
                    if (options[i].id === value) {
                        value = options[i].name;
                        break;
                    }
                }
            }

            if (values.length) {
                value = values.join("\n");
            }
        } else if (input.type == 'datetime') {
            return this.datetime(item, input);
        }

        if (typeof input.afterValue === 'function') {
            value = input.afterValue(item, value);
        }

        return (
            <DivInput
                type={values.length ? 'text' : 'string'}
                readonly={input.readonly}
                center={input.center}
                item={item}
                value={value}
                with={this.with(input, item)}
                text_key={input.text_key}
                onInput={(value, callback) => this.props.onItemChange(item.id, input.name, value, callback)}
                href={input.href}
                target={input.target}
                heightAuto={input.heightAuto}
            />
        );
    }

    datetime(item, input) {
        var value = item[input.name];

        if (typeof input.text_key !== 'undefined') {
            var withObj = this.with(input, item);
            value = withObj[input.text_key];
        }

        return <DivInput
            type="string"
            readonly={input.readonly}
            center={input.center}
            value={dateFormat(value, input.format)}
            onInput={(value, callback) => this.props.onItemChange(item.id, input.name, value, callback)}
        />;
    }

    text(item, input) {
        return (
            <DivInput
                type="text"
                readonly={input.readonly}
                center={input.center}
                item={item}
                value={item[input.name]}
                with={this.with(input, item)}
                text_key={input.text_key}
                onInput={(value, callback) => this.props.onItemChange(item.id, input.name, value, callback)}
                href={input.href}
                target={input.target}
                heightAuto={input.heightAuto}
            />
        );
    }

    texteditor(item, input) {
        return (
            <DivInput
                type="text"
                readonly={input.readonly}
                center={input.center}
                value={item[input.name]}
                onInput={(value, callback) => this.props.onItemChange(item.id, input.name, value, callback)}
            />
        );
    }

    actions(item, isChecked, isEditDisabled, isMeEdit, isTimerDelete) {
        let actions = [];

        if (isEditDisabled) {
            let avatar = item.editor_user ? item.editor_user.name.split(' ') : ['В', 'Ы'];

            avatar = avatar.length > 1
                ? avatar[0][0] + avatar[1][0]
                : avatar[0][0];

            actions.push(
                <OverlayTrigger
                    key={'editor_' + item.id}
                    placement="top"
                    overlay={
                        <Tooltip>{isMeEdit ? <>Вы уже редактируете на другой вкладке</> : <>Редактирует<br />{item.editor_user.name}</>}</Tooltip>
                    }
                ><div className="avatar">{avatar}</div></OverlayTrigger>
            )
        } else {
            if (this.props.items.checkbox) {
                actions.push(
                    <Checkbox
                        key={'del_' + item.id}
                        checked={isChecked}
                        onChange={() => this.props.itemSelect(item.id)}
                    />
                )
            }

            if (item.deleted_at) {
                if (this.props.items.softDeletes) {
                    actions.push(
                        <OverlayTrigger
                            key={'recover_' + item.id}
                            placement="top"
                            overlay={
                                <Tooltip>Восстановить</Tooltip>
                            }
                        >
                            <svg onClick={() => this.props.itemRestore(item.id)} className="icon restore-icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.0849 4.22427C16.0849 4.22427 14.1127 0.920807 9.44753 0.920807C7.77677 0.920807 6.14352 1.40695 4.75434 2.31776C3.36515 3.22858 2.28241 4.52315 1.64303 6.03778C1.00366 7.55241 0.836371 9.21906 1.16232 10.827C1.48827 12.4349 2.29282 13.9119 3.47423 15.0711C4.65563 16.2304 6.16084 17.0198 7.7995 17.3397C9.43816 17.6595 11.1367 17.4953 12.6803 16.868C14.2238 16.2406 15.5432 15.1781 16.4714 13.815C17.3996 12.4519 17.8951 10.8493 17.8951 9.20987" stroke="black" strokeWidth="0.8" strokeMiterlimit="10" strokeLinecap="round" /><path d="M16.2978 0.899994V4.30444H12.8933" stroke="black" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </OverlayTrigger>
                    );

                    if (isTimerDelete) {
                        let dateForcedDelete = new Date(this.props.items.dateForcedDelete),
                            deletedDate = new Date(item.deleted_at),
                            diff = deletedDate - dateForcedDelete;

                        let days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0,
                            hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0,
                            minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;

                        days = days < 10 ? '0' + days : days;
                        hours = hours < 10 ? '0' + hours : hours;
                        minutes = minutes < 10 ? '0' + minutes : minutes;

                        actions.push(
                            <div className="deletedText">
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6L6 1L11 6" stroke="black" strokeWidth="0.8" /></svg>
                                Удалится навсегда через {days}д. {hours}ч. {minutes}м.
                            </div>
                        )
                    }
                }
            } else {
                if (this.props.items.delete || (this.props.items.softDeletes && this.props.page.config('deleteAction', true))) {
                    actions.push(
                        <OverlayTrigger
                            key={'delete_' + item.id}
                            placement="top"
                            overlay={
                                <Tooltip>Удалить</Tooltip>
                            }
                        >
                            <svg onClick={() => this.props.itemDelete(item.id)} className="icon delete-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 7V14.5C0.5 16.1569 1.84315 17.5 3.5 17.5H14.5C16.1569 17.5 17.5 16.1569 17.5 14.5V7" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="4.9" y1="7.4" x2="4.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="8.9" y1="7.4" x2="8.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="12.9" y1="7.4" x2="12.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M0.5 5.5V5.5C0.5 3.84315 1.84315 2.5 3.5 2.5H14.5C16.1569 2.5 17.5 3.84315 17.5 5.5V5.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M17.5 5.5H0.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M6.5 2.5V2.5C6.5 1.39543 7.39543 0.5 8.5 0.5H9.5C10.6046 0.5 11.5 1.39543 11.5 2.5V2.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /></svg>
                        </OverlayTrigger>
                    );
                }
            }

            if (this.props.items.edit) {
                actions.push(
                    <OverlayTrigger
                        key={'edit_' + item.id}
                        placement="top"
                        overlay={
                            <Tooltip>Редактировать</Tooltip>
                        }
                    >
                        <svg onClick={() => this.props.setItemEdit(item.id)} className="icon edit-icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0.5H4C2.34315 0.5 1 1.84315 1 3.5V14.5C1 16.1569 2.34315 17.5 4 17.5H15C16.6569 17.5 18 16.1569 18 14.5V9" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M17.2929 2.50123L15.9988 1.20711C15.6082 0.816583 14.9751 0.816582 14.5846 1.20711L6.26656 9.5251C6.14639 9.64527 6.05883 9.79408 6.01215 9.95749L5.54167 11.6042L5.4945 11.7693C5.27897 12.5236 5.97639 13.221 6.73074 13.0055L8.54251 12.4879C8.70592 12.4412 8.85473 12.3536 8.9749 12.2334L17.2929 3.91544C17.6834 3.52492 17.6834 2.89175 17.2929 2.50123Z" stroke="black" strokeWidth="0.8" /></svg>
                    </OverlayTrigger>
                )
            }

            if (this.props.items.copy) {
                actions.push(
                    <OverlayTrigger
                        key={'copy_' + item.id}
                        placement="top"
                        overlay={
                            <Tooltip>Дублировать</Tooltip>
                        }
                    >
                        <svg onClick={() => this.props.itemCopy(item.id)} className="icon edit-icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7318 2.54825C15.7318 2.03504 15.6507 1.69594 15.1849 1.23016C14.7192 0.764377 14.088 0.501874 13.4292 0.5H3.84097C3.08818 0.502225 2.36686 0.802255 1.83456 1.33456C1.30226 1.86686 1.00222 2.58818 1 3.34097V12.9292C1.00187 13.588 1.26438 14.2192 1.73016 14.6849C2.19594 15.1507 2.53504 15.2318 3.04825 15.4151" stroke="black" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.4698 2.58492H5.61514C4.21773 2.58492 3.0849 3.71774 3.0849 5.11515V14.9698C3.0849 16.3672 4.21773 17.5 5.61514 17.5H15.4698C16.8672 17.5 18 16.3672 18 14.9698V5.11515C18 3.71774 16.8672 2.58492 15.4698 2.58492Z" stroke="black" strokeWidth="0.8" strokeLinejoin="round" /></svg>
                    </OverlayTrigger>
                )
            }
        }

        return <td>
            <div className="actions">
                {actions}
            </div>
        </td>
    }

    render() {
        if (this.props.paginate.data.length) {
            let isColumnsResult = false;

            if (Object.keys(this.props.items.result).length > 0) {
                for (let i = 0; i < this.props.page.form.length; i++) {
                    if (this.props.items.columns[i] !== 0) {
                        isColumnsResult = true;
                    }

                    if (this.props.page.form[i].filter !== false) {
                        isColumnsResult = true;
                    }

                    if (isColumnsResult) {
                        break;
                    }
                }
            }

            return <>
                {isColumnsResult &&
                    <tr className="columnsResult" key="columnsResult">
                        <td key="emptyTdColumnsResult"><div className="columnResultLabel">Итог:</div></td>
                        {
                            this.props.page.form.map((inputOriginal, i) => (
                                <td key={'resultTd' + i}><div className={'columnResult' + (inputOriginal.center ? ' text-center' : '')}>{this.props.items.result[inputOriginal.name] ? this.props.items.result[inputOriginal.name] : '—'}</div></td>
                            ))
                        }
                    </tr>
                }
                <ViewportList
                    items={this.props.paginate.data}
                    spacerElement="tr"
                    overscan={10}
                >
                    {item => {
                        let isEditDisabled = item.editor_user_id ? true : false,
                            isMeEdit = this.props.user.id ? this.props.user.id == item.editor_user_id : false;

                        if (isMeEdit) {
                            isEditDisabled = false;
                        }

                        let editTabItem = this.props.editingTabItems['admined-edit-' + item.id];

                        if (editTabItem) {
                            if (editTabItem.url == this.props.page.url) {
                                isEditDisabled = true;
                                isMeEdit = true;
                            }
                        }

                        let isChecked = this.props.itemsSelected.indexOf(item.id) > -1,
                            isTimerDelete = this.props.items.dateForcedDelete && item.deleted_at ? true : false,
                            className = (isEditDisabled ? 'editing' : '') +
                                (isChecked ? ' checked' : '') +
                                (item.deleted_at ? ' deleted' : '') +
                                (isTimerDelete ? ' isTimerDelete' : '');

                        return <tr key={item.id} data-item-id={item.id} className={className}>
                            {this.actions(item, isChecked, isEditDisabled, isMeEdit, isTimerDelete)}
                            {
                                this.props.page.form.map((inputOriginal, i) => {
                                    let input = Object.assign({}, inputOriginal);

                                    if (this.props.items.columns[i] === 0) {
                                        return false;
                                    }

                                    if (input.filter === false) {
                                        return false;
                                    }

                                    if (this.props.items.fastEdit === 0) {
                                        input.readonly = true;
                                    }

                                    if (typeof input.value === 'function') {
                                        item = input.value(Object.assign({}, item));
                                    }

                                    let element = null;

                                    if (input.type) {
                                        if (typeof this[input.type] !== 'undefined') {
                                            element = this[input.type](item, input);
                                        } else {
                                            element = this.string(item, input);
                                        }
                                    } else {
                                        element = this.string(item, input);
                                    }

                                    return <td key={item.id + '_' + input.name} className={input.center ? 'text-center' : ''}>{element}</td>
                                })
                            }
                        </tr>
                    }}
                </ViewportList >
            </>
        }

        return <tr className="empty text-center"><td colSpan="100%">Ничего не найдено</td></tr>
    }

}

export default Items;