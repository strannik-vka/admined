import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import File from "../../app/components/File";
import Input from "../../app/components/input";
import TextEditor from "../../app/components/texteditor";
import CustomField from "../../app/components/customField";
import Poll from "../../app/components/poll";
import Gallery from "../../app/components/gallery";
import ConstructorFields from "./Constructor/ConstructorFields";
import Label from "./form/Label";
import Description from "./form/Description";

class Constructor extends React.Component {

    constructor(props) {
        super(props);

        this.fieldsToCreate = ConstructorFields;

        let fieldsFromUser = Array.isArray(this.props.fields) ? this.props.fields : [];

        fieldsFromUser = fieldsFromUser.map(item => {
            return {
                type: item.name,
                placeholder: item.placeholder,
                description: item.description,
                src: item.src,
                svg: item.svg,
            };
        });

        let fields = this.getFieldsDB(),
            fieldsToCreate = [...this.fieldsToCreateAllow(), ...fieldsFromUser];

        if (fields.length == 0 && fieldsToCreate.length) {
            let idGenerate = this.generateId();

            fields.push({
                name: this.props.name + '[' + fieldsToCreate[0].type + '_' + idGenerate + ']',
                id: idGenerate,
                type: fieldsToCreate[0].type,
                value: ''
            });
        }

        this.state = {
            fields: fields,
            fieldsToCreate: fieldsToCreate,
            screen: null
        }
    }

    fieldsToCreateAllow() {
        if (Array.isArray(this.props.defaultFields)) {
            let result = [];

            this.props.defaultFields.forEach(type => {
                for (let i = 0; i < this.fieldsToCreate.length; i++) {
                    let field = this.fieldsToCreate[i];

                    if (field.type == type) {
                        result.push(field);
                    }
                }
            });

            if (result.length) {
                this.fieldsToCreate = result;
            }
        }

        return this.fieldsToCreate;
    }

    getFieldsDB() {
        let fields = [];

        if (Array.isArray(this.props.value)) {
            this.props.value.forEach(item => {
                let name = Object.keys(item)[0],
                    nameArr = name.split('_');

                fields.push({
                    name: this.props.name + '[' + name + ']',
                    id: nameArr[1],
                    type: nameArr[0],
                    value: item[name]
                });
            });
        } else if (typeof this.props.value === 'string') {
            let idGenerate = this.generateId();

            fields.push({
                name: this.props.name + '[texteditor_' + idGenerate + ']',
                id: idGenerate,
                type: 'texteditor',
                value: this.props.value
            });
        }

        return fields;
    }

    generateId() {
        return new String(Math.random()).replace('.', '');
    }

    addField = (type, id) => {
        document.body.click();

        var idGenerate = this.generateId(),
            name = this.props.name + '[' + type + '_' + idGenerate + ']';

        this.setState(prevState => {
            let item = {
                name: name,
                type: type,
                id: idGenerate
            };

            if (id !== null) {
                let indexPaste = null;

                prevState.fields.forEach((element, index) => {
                    if (element.id === id) {
                        indexPaste = index;
                    }
                });

                prevState.fields.splice(indexPaste, 0, item);
            } else {
                prevState.fields.push(item);
            }

            return {
                fields: prevState.fields
            };
        }, () => {
            let input = document.querySelector('[name="' + name + '"]');

            if (!input) {
                input = document.querySelector('[data-name="' + name + '"]');
            }

            if (input) {
                if (input.getAttribute('type') == 'file') {
                    input.click();
                } else {
                    input.focus();
                }
            }
        });
    }

    delField = (id) => {
        let inputs = document.querySelectorAll('[name*="' + id + '"]'),
            isValue = null;

        if (inputs.length) {
            inputs.forEach(input => {
                if (input.value) {
                    isValue = true;
                }
            });
        }

        if (isValue) {
            if (!confirm('Подтверждаете удаление?')) {
                return false;
            }
        }

        this.setState(prevState => {
            prevState.fields = prevState.fields.filter((field) => id !== field.id);

            return {
                fields: prevState.fields
            };
        });
    }

    dragField = (id, up) => {
        this.setState((prevState) => {
            let indexPaste = null,
                fieldPaste = null;

            prevState.fields.forEach((field, index) => {
                if (field.id === id) {
                    indexPaste = index;
                    fieldPaste = field;
                }
            });

            prevState.fields.splice(up ? indexPaste - 1 : indexPaste + 2, 0, fieldPaste);
            prevState.fields.splice(up ? indexPaste + 1 : indexPaste, 1);

            return {
                fields: prevState.fields
            };
        });
    }

    onMouseEnter = (field) => {
        this.setState({
            screen: this.props.screen && this.props.screen[field.type]
                ? this.props.screen[field.type] : null
        });
    }

    onMouseLeave = () => {
        this.setState({
            screen: null
        });
    }

    getActions(id, index) {
        let buttons = [],
            isEnd = index === undefined,
            isPenult = (this.state.fields.length - 1) === index,
            isFirst = index === 0;

        if (isEnd) {
            buttons.push(<div key={'btn_' + id + '_' + index + '_empty'} className="desc">Жми на плюсик, чтобы добавить контент</div>);
        } else {
            buttons.push(<div key={'btn_' + id + '_' + index + '_add'} className="multiple_block_icon" onClick={() => this.delField(id)}><svg className="delete" viewBox="0 0 14 14"><path d="M13.5000308,3.23952 C13.5000308,4.55848168 11.9230308,12.0493 11.9230308,12.0782 C11.9230308,12.6571 9.73825083,14 7.04165083,14 C4.34504083,14 2.16025083,12.6571 2.16025083,12.0782 C2.16025083,12.0541 0.5,4.55799105 0.5,3.23952 C0.5,1.91780104 3.02713083,0 7.03525083,0 C11.0433308,0 13.5000308,1.9178004 13.5000308,3.23952 Z M7,2 C3.625,2 2.5,3.25 2.5,4 C2.5,4.75 3.625,6 7,6 C10.375,6 11.5,4.75 11.5,4 C11.5,3.25 10.375,2 7,2 Z"></path></svg></div>);

            if (!isFirst) {
                buttons.push(<div key={'btn_' + id + '_' + index + '_up'} className="multiple_block_icon" onClick={() => this.dragField(id, true)}><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8.53033 1.36967C8.23744 1.07678 7.76256 1.07678 7.46967 1.36967L2.6967 6.14264C2.40381 6.43554 2.40381 6.91041 2.6967 7.2033C2.98959 7.4962 3.46447 7.4962 3.75736 7.2033L8 2.96066L12.2426 7.2033C12.5355 7.4962 13.0104 7.4962 13.3033 7.2033C13.5962 6.91041 13.5962 6.43554 13.3033 6.14264L8.53033 1.36967ZM8.75 14.9V1.9H7.25L7.25 14.9H8.75Z" /></svg></div>);
            }

            if (!isPenult) {
                buttons.push(<div key={'btn_' + id + '_' + index + 'down'} className="multiple_block_icon" onClick={() => this.dragField(id)}><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.46967 14.6303C7.76256 14.9232 8.23744 14.9232 8.53033 14.6303L13.3033 9.85736C13.5962 9.56447 13.5962 9.08959 13.3033 8.7967C13.0104 8.5038 12.5355 8.5038 12.2426 8.7967L8 13.0393L3.75736 8.7967C3.46447 8.5038 2.98959 8.5038 2.6967 8.7967C2.40381 9.08959 2.40381 9.56446 2.6967 9.85736L7.46967 14.6303ZM7.25 1.1L7.25 14.1L8.75 14.1L8.75 1.1L7.25 1.1Z" /></svg></div>);
            }
        }

        let plusBtn = this.fieldsToCreate.length == 1
            ? <div onClick={() => this.addField(this.fieldsToCreate[0].type, id)} className="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div>
            : <OverlayTrigger
                trigger="click"
                key="right"
                placement="right"
                rootClose={true}
                overlay={
                    <Popover>
                        <Popover.Header as="h3">
                            Выберите поле
                            {
                                this.state.screen ? <div className="constructor-screen">
                                    <img src={this.state.screen} />
                                </div> : ''
                            }
                        </Popover.Header>
                        <Popover.Body>
                            {
                                this.state.fieldsToCreate.map((field, index) => {
                                    let screen = this.props.screen && this.props.screen[field.type]
                                        ? this.props.screen[field.type] : null,
                                        img = '';

                                    if (field.svg) {
                                        img = field.svg;
                                    } else if (field.src) {
                                        img = '<img src="' + field.src + '" />';
                                    } else if (screen) {
                                        img = '<img src="' + screen + '" />';
                                    }

                                    return <div key={'field_' + id + '_' + index} className="constructor-field"
                                        onClick={() => this.addField(field.type, id)}
                                        onMouseEnter={() => this.onMouseEnter(field)}
                                        onMouseLeave={() => this.onMouseLeave()}
                                    >
                                        <div
                                            className="icon"
                                            dangerouslySetInnerHTML={{ __html: img }}
                                        ></div>
                                        <div>
                                            <div className="label">{field.placeholder}</div>
                                            <div className="description">{field.description}</div>
                                        </div>
                                    </div>
                                })
                            }
                        </Popover.Body>
                    </Popover>
                }
            ><div className="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div></OverlayTrigger>;

        return <div className={'constructor-actions ' + (isEnd ? 'end' : 'mb-2')}>
            {plusBtn}
            {buttons}
        </div>
    }

    getField(field) {
        let result = null;

        if (field.type == 'string') {
            result = <Input name={field.name} value={field.value} />
        } else if (field.type == 'texteditor') {
            result = <TextEditor name={field.name} value={field.value} />
        } else if (field.type == 'image') {
            result = <File name={field.name} value={field.value} deleteRequest={field.deleteRequest} />
        } else if (field.type == 'gallery') {
            result = <Gallery
                name={field.name}
                value={field.value}
                onDelete={() => this.delField(field.id)}
            />
        } else if (field.type == 'video') {
            result = <Input name={field.name} value={field.value} type="video" />
        } else if (field.type == 'audio') {
            result = <File name={field.name} value={field.value} deleteRequest={field.deleteRequest} />
        } else if (field.type == 'file') {
            result = <File name={field.name} value={field.value} deleteRequest={field.deleteRequest} />
        } else if (field.type == 'poll') {
            result = <Poll name={field.name} value={field.value} {...(this.props.options && this.props.options.poll ? this.props.options.poll : null)} />
        } else {
            result = <CustomField field={field} fields={this.props.fields} />
        }

        return result;
    }

    getHiddenFields() {
        let result = [];

        this.state.fields.map(field => {
            result.push(field.id);
        });

        return <>
            <input type="hidden" name={this.props.name + '_sort'} value={result.join(',')} />
            {
                this.state.fields.length == 0
                    ? <input type="hidden" name={this.props.name} value="" />
                    : ''
            }
        </>
    }

    render() {
        return <fieldset className="notLegend">
            {
                this.state.fields.map((field, index) => {
                    return <div
                        key={field.id}
                        className="form-group mb-3"
                    >
                        {this.getActions(field.id, index)}
                        <Label text={field.placeholder} />
                        <Description text={field.description} />
                        {this.getField(field)}
                    </div>
                })
            }
            {
                this.getActions(null)
            }
            {
                this.getHiddenFields()
            }
        </fieldset>
    }

}

export default Constructor;