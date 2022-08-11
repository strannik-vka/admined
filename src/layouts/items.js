import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DivInput from "../components/divInput";
import Checkbox from "../components/checkbox";
import Switch from "../components/switch";
import Select from "../components/select";

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

            if (JSON.stringify(options).indexOf('"id":' + option.id + '') == -1) {
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

    actions(item) {
        var isActions = this.props.page.config('deleteAction', true) || this.props.page.config('editAction', true);

        if (isActions) {
            return (
                <td>
                    <div className="actions">
                        {
                            this.props.page.config('deleteAction', true)
                                ? <Checkbox checked={this.props.itemsSelected.indexOf(item.id) > -1} onChange={() => this.props.itemSelect(item.id)} />
                                : ''
                        }
                        {
                            this.props.page.config('editAction', true)
                                ? <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-top">Редактировать</Tooltip>
                                    }
                                >
                                    <svg onClick={() => this.props.setItemEdit(item.id)} className="edit-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16.5368 0.251576C16.2017 -0.0838586 15.6592 -0.0838586 15.325 0.251576C15.2401 0.336507 15.1107 0.357115 14.9993 0.313362C14.0797 -0.0400879 12.9981 0.153809 12.2568 0.895882L2.9374 10.2245C2.80285 10.3584 2.80285 10.5763 2.9374 10.7101L7.30057 15.0776C7.43427 15.2115 7.6511 15.2115 7.7848 15.0776L17.1042 5.74894C17.8464 5.00687 18.0401 3.9242 17.6861 3.00369C17.6433 2.89131 17.6638 2.76262 17.7487 2.67769C18.0838 2.34225 18.0838 1.79921 17.7487 1.46463L16.5368 0.251576ZM16.0989 3.84357C16.2326 3.9774 16.2326 4.19528 16.0989 4.32911L7.7848 12.6515C7.6511 12.7854 7.43427 12.7854 7.30057 12.6515L5.3611 10.7101C5.2274 10.5763 5.2274 10.3584 5.3611 10.2245L13.6752 1.90305C13.8089 1.76836 14.0257 1.76836 14.1594 1.90305L16.0989 3.84357Z" fill="#1672EC"></path><path d="M0.43314 17.9876C0.177744 18.0571 -0.0570812 17.8221 0.0123386 17.5664L1.51729 12.0433C1.58671 11.7885 1.90466 11.7045 2.09064 11.8906L6.10328 15.9081C6.28926 16.0943 6.20527 16.4117 5.95073 16.4812L0.43314 17.9876Z" fill="#1672EC"></path></svg>
                                </OverlayTrigger>
                                : ''
                        }
                    </div>
                </td>
            )
        }
    }

    render() {
        return this.props.paginate.data.length
            ? this.props.paginate.data.map((item) =>
                <tr key={item.id}>
                    {this.actions(item)}
                    {
                        this.props.page.form.map(input => {
                            if (typeof input.value === 'function') {
                                item = input.value(Object.assign({}, item));
                            }

                            return input.filter === false ? false :
                                <td key={item.id + '_' + input.name} className={input.center ? 'text-center' : ''}>
                                    {this[!input.readonly && input.type ? input.type : 'string'](item, input)}
                                </td>
                        })
                    }
                </tr>
            )
            : <tr className="empty text-center"><td colSpan="100%">Ничего не найдено</td></tr>;
    }

}

export default Items;