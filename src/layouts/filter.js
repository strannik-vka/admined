import React from "react";
import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import DivInput from "../components/divInput";
import Checkbox from "../components/checkbox";
import Select from "../components/select";
import Switch from "../components/switch";

class Filter extends React.Component {

    constructor(props) {
        super(props);
    }

    actions() {
        var actions = [];

        if (this.props.items.checkbox) {
            actions.push(
                <Checkbox
                    key="itemsCheckbox"
                    checked={(this.props.itemsSelectedCountMax == this.props.itemsSelectedCount) && this.props.itemsSelectedCount}
                    onChange={this.props.itemsSelectAll}
                />
            );

            if (this.props.page.config('deleteAction', true)) {
                actions.push(
                    <OverlayTrigger
                        key="itemsDelete"
                        placement="top"
                        overlay={
                            <Tooltip>{this.props.itemsSelectedCount ? 'Удалить' : 'Выберите записи'}</Tooltip>
                        }
                    >
                        <div className="icon">
                            <svg onClick={() => this.props.itemDelete('selected')} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 7V14.5C0.5 16.1569 1.84315 17.5 3.5 17.5H14.5C16.1569 17.5 17.5 16.1569 17.5 14.5V7" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="4.9" y1="7.4" x2="4.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="8.9" y1="7.4" x2="8.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><line x1="12.9" y1="7.4" x2="12.9" y2="14.6" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M0.5 5.5V5.5C0.5 3.84315 1.84315 2.5 3.5 2.5H14.5C16.1569 2.5 17.5 3.84315 17.5 5.5V5.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M17.5 5.5H0.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /><path d="M6.5 2.5V2.5C6.5 1.39543 7.39543 0.5 8.5 0.5H9.5C10.6046 0.5 11.5 1.39543 11.5 2.5V2.5" stroke="black" strokeWidth="0.8" strokeLinecap="round" /></svg>
                            {
                                this.props.itemsSelectedCount ?
                                    <div onClick={() => this.props.itemDelete('selected')} className="selectedCount">{this.props.itemsSelectedCount}</div> : ''
                            }
                        </div>
                    </OverlayTrigger>
                );
            }
        }

        actions.push(
            <OverlayTrigger
                key="itemsSettings"
                trigger="click"
                placement="right"
                rootClose={true}
                overlay={
                    <Popover>
                        <Popover.Header as="h3">Настройка таблицы</Popover.Header>
                        <Popover.Body className="smooth">
                            <div className="form-group mb-0">
                                <Switch
                                    checked={this.props.items.fastEdit}
                                    placeholder="Быстрое редактирование"
                                    onChange={(val) => this.props.fastEditToggle(val)}
                                />

                                <hr className="hr" />

                                {
                                    this.props.items.softDeletes ? <>
                                        <label className="mb-2">Отображать записи:</label>
                                        <Switch
                                            checked={this.props.items.displayMethod === 1}
                                            placeholder="Активные + удаленные"
                                            onChange={() => this.props.setDisplayMethod(1)}
                                        />
                                        <Switch
                                            checked={this.props.items.displayMethod === 2}
                                            placeholder="Только активные"
                                            onChange={() => this.props.setDisplayMethod(2)}
                                        />
                                        <Switch
                                            checked={this.props.items.displayMethod === 3}
                                            placeholder="Только удаленные"
                                            onChange={() => this.props.setDisplayMethod(3)}
                                        />
                                        <hr className="hr" />
                                    </> : ''
                                }

                                <label className="mb-2">Отображать столбцы:</label>
                                {
                                    this.props.page.form.map((input, i) => {
                                        if (input.filter === false) {
                                            return false;
                                        }

                                        return <Switch
                                            key={'itemColumn' + i}
                                            checked={this.props.items.columns[i] !== 0}
                                            placeholder={input.placeholder}
                                            onChange={(val) => this.props.setItemColumns(i, val)}
                                        />
                                    })
                                }
                            </div>
                        </Popover.Body>
                    </Popover>
                }
            >
                <svg className="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.25703 6.47026C8.72045 6.41875 8.18061 6.52971 7.71142 6.78794C7.24223 7.04618 6.86662 7.43908 6.63603 7.91283C6.40543 8.38658 6.33112 8.91804 6.42326 9.43443C6.51541 9.95083 6.7695 10.4269 7.15076 10.7975C7.53203 11.1681 8.02181 11.4151 8.55307 11.5047C9.08432 11.5942 9.63107 11.522 10.1185 11.2979C10.6058 11.0737 11.01 10.7086 11.2757 10.2525C11.5414 9.79647 11.6555 9.27173 11.6025 8.75016C11.5421 8.16548 11.2756 7.61908 10.8481 7.20357C10.4207 6.78805 9.85853 6.52898 9.25703 6.47026V6.47026ZM15.554 9C15.5523 9.27631 15.5314 9.5522 15.4914 9.82577L17.3388 11.2342C17.4193 11.299 17.4735 11.3895 17.4918 11.4895C17.5101 11.5895 17.4914 11.6925 17.4389 11.7804L15.6912 14.7196C15.6382 14.8066 15.5552 14.8726 15.457 14.906C15.3588 14.9393 15.2516 14.9379 15.1543 14.9019L13.3196 14.1838C13.2184 14.1447 13.1088 14.1305 13.0006 14.1426C12.8924 14.1548 12.789 14.1928 12.6997 14.2533C12.4197 14.4407 12.1254 14.6073 11.8195 14.7514C11.7233 14.7968 11.6401 14.8646 11.5773 14.9487C11.5144 15.0328 11.4738 15.1306 11.4591 15.2336L11.1841 17.1358C11.166 17.2362 11.1126 17.3275 11.033 17.3939C10.9534 17.4603 10.8526 17.4978 10.7477 17.5H7.25231C7.14915 17.4983 7.04967 17.4624 6.97027 17.3984C6.89086 17.3343 6.83627 17.2459 6.81549 17.1477L6.54089 15.2483C6.52547 15.1442 6.48383 15.0454 6.41967 14.9607C6.35551 14.8761 6.27082 14.8081 6.17313 14.7629C5.86756 14.6196 5.57432 14.4526 5.29621 14.2636C5.20717 14.2034 5.10412 14.1657 4.99633 14.1538C4.88854 14.142 4.77942 14.1564 4.67878 14.1957L2.84446 14.9135C2.74725 14.9494 2.6401 14.9509 2.54187 14.9176C2.44365 14.8844 2.36066 14.8185 2.30752 14.7315L0.559832 11.7923C0.507288 11.7045 0.488511 11.6014 0.506844 11.5014C0.525177 11.4014 0.579431 11.3109 0.659945 11.2461L2.2213 10.0546C2.30684 9.98855 2.37407 9.90283 2.41689 9.80517C2.4597 9.7075 2.47675 9.60099 2.46648 9.4953C2.45177 9.32967 2.44278 9.16444 2.44278 8.99881C2.44278 8.83318 2.45136 8.67033 2.46648 8.50827C2.47563 8.40322 2.45775 8.29761 2.41445 8.20096C2.37115 8.1043 2.30379 8.01963 2.21844 7.95458L0.657902 6.76299C0.578694 6.69789 0.525584 6.60777 0.507877 6.50842C0.49017 6.40907 0.508997 6.30683 0.561058 6.21963L2.30875 3.28037C2.36183 3.19338 2.44479 3.1274 2.54302 3.09404C2.64124 3.06069 2.74843 3.06211 2.84568 3.09806L4.68042 3.81619C4.78159 3.85535 4.89118 3.8695 4.99937 3.85737C5.10755 3.84523 5.21095 3.8072 5.3003 3.74668C5.58031 3.55925 5.87455 3.39275 6.18048 3.2486C6.27666 3.20316 6.35985 3.1354 6.42271 3.0513C6.48557 2.96721 6.52615 2.86936 6.54089 2.7664L6.81589 0.864229C6.83396 0.763771 6.88735 0.672528 6.96695 0.606094C7.04655 0.53966 7.14741 0.502159 7.25231 0.5H10.7477C10.8509 0.501735 10.9503 0.537575 11.0297 0.601616C11.1091 0.665657 11.1637 0.754079 11.1845 0.852313L11.4591 2.75171C11.4745 2.8558 11.5162 2.95457 11.5803 3.03925C11.6445 3.12393 11.7292 3.19189 11.8269 3.23708C12.1324 3.38045 12.4257 3.54741 12.7038 3.73636C12.7928 3.79658 12.8959 3.83431 13.0037 3.84617C13.1115 3.85803 13.2206 3.84363 13.3212 3.80428L15.1555 3.08654C15.2527 3.05056 15.3599 3.04908 15.4581 3.08236C15.5563 3.11563 15.6393 3.18154 15.6925 3.26846L17.4402 6.20771C17.4927 6.29553 17.5115 6.39862 17.4932 6.49863C17.4748 6.59864 17.4206 6.68909 17.3401 6.75386L15.7787 7.94544C15.6928 8.01123 15.6252 8.09686 15.582 8.19454C15.5388 8.29221 15.5214 8.39883 15.5315 8.5047C15.545 8.66914 15.554 8.83437 15.554 9Z" stroke="black" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </OverlayTrigger>
        );

        if (actions.length) {
            return (
                <th className="filter-item">
                    <div className="actions">{actions}</div>
                </th>
            )
        }
    }

    getInputHtml(input, key, value) {
        var result = null;

        if (input.type == 'select') {
            let options = [];

            if (Array.isArray(this.props.page.vars[key.replace('_id', '').replace('[]', '')])) {
                options = Array.from(this.props.page.vars[key.replace('_id', '').replace('[]', '')]);
            }

            result = <Select
                key={value + '_' + JSON.stringify(options)}
                name={key.replace('[]', '')}
                options={options}
                placeholder={input.placeholder}
                value={value}
                onChange={(value) => this.props.onChange(value, key)}
                text_key={input.text_key}
                url={input.url}
            />;
        } else if (input.type == 'switch') {
            result = <Select
                name={key}
                options={[{ name: 'Да', value: 1 }, { name: 'Нет', value: 0 }]}
                placeholder={input.placeholder}
                value={value}
                onChange={(value) => this.props.onChange(value, key)}
            />;
        } else {
            result = <DivInput
                readonly={input.filter === 'readonly'}
                name={key}
                placeholder={input.placeholder}
                center={input.center}
                value={value}
                onInput={(value, callback) => this.props.onChange(value, key, callback)}
            />;
        }

        if (this.isSortField(input.name)) {
            result = <>{result}{this.sortRender(key)}</>;
        }

        if (typeof input.description !== 'undefined') {
            result = <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                    <Tooltip>{input.description}</Tooltip>
                }
            >{result}</OverlayTrigger>
        }

        return result;
    }

    sortRender(name) {
        let isActive = this.props.sort.active.name === name,
            className = 'svgWrap',
            setUp = true;

        if (isActive) {
            className += ' active';

            if (this.props.sort.active.up) {
                className += ' up';
            } else {
                className += ' down';
            }

            setUp = !this.props.sort.active.up;
        }

        return <div className="sort">
            <div className={className} onClick={() => this.props.onSortChange(name, setUp)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line className="up" x1="13" y1="5.91421" x2="11.4142" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line className="up" x1="14.5858" y1="7.5" x2="13" y2="5.91421" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line className="up" x1="13" y1="7" x2="13" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line className="down" x1="7" y1="14.0858" x2="8.58579" y2="12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line className="down" x1="5.41421" y1="12.5" x2="7" y2="14.0858" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line className="down" x1="7" y1="13" x2="7" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    }

    isSortField(name) {
        return Array.isArray(this.props.sort.columns)
            ? this.props.sort.columns.indexOf(name) > -1
            : this.props.sort.columns;
    }

    render() {
        return <>
            {this.actions()}
            {
                this.props.page.form.map((input, i) => {
                    if (this.props.items.columns[i] === 0) {
                        return false;
                    }

                    let key = input.name;

                    if (typeof input.text_key !== 'undefined' && typeof input.with !== 'undefined') {
                        key = input.with + '_' + input.text_key;
                    }

                    return (
                        input.filter === false
                            ? false
                            : <th
                                key={key}
                                className={'filter-item' + (this.isSortField(input.name) ? ' isSort' : '')}
                            >
                                <div className="filter-wrap">
                                    {
                                        this.getInputHtml(input, key, this.props.page.filter[key])
                                    }
                                </div>
                            </th>
                    )
                })
            }
        </>
    }

}

export default Filter;