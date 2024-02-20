import styles from '../../app/scss/shared/ui/FieldGroup.module.scss';

import React, { useState } from 'react';

import Description from './form/Description';
import InvalidText from './form/InvalidText';
import ValueSize from './form/ValueSize';
import ValueCount from './form/ValueCount';
import Label from './form/Label';

import Constructor from '../ui/Constructor/Constructor';
import Poll from '../../app/components/poll';
import Gallery from '../../app/components/gallery';
import Select from '../../app/components/select';
import Checkbox from '../../app/components/checkbox';
import StringDiv from '../../app/components/divInput';
import String from './form/String';
import StringVideo from './form/StringVideo';
import TextEditor from '../../app/components/texteditor';
import Textarea from '../../app/components/textarea';
import File from '../../app/components/File';
import Switch from '../../app/components/switch';
import CustomField from '../../app/components/customField';

const FieldGroup = (props) => {
    const [value, setValue] = useState(props.value);

    const onInputHandler = (value, e) => {
        setValue(value);

        if (typeof props.onInput === 'function') {
            props.onInput(value, e);
        }
    }

    let content = null,
        contentAppend = [],
        isValueSize = false,
        isValueCount = false,
        className = styles.FieldGroup,
        formName = (props.form ? props.form : props.type).toLowerCase();

    if (props.readonly) {
        className += ' ' + styles.readonly;
    }

    if (formName == 'constructor') {
        content = <Constructor {...props} />
    } else if (formName == 'poll') {
        content = <Poll {...props} />
    } else if (formName == 'gallery') {
        content = <Gallery {...props} onInput={onInputHandler} />
        isValueCount = true;
    } else if (formName == 'select') {
        content = <Select {...props} onInput={onInputHandler} />
        isValueCount = true;
    } else if (formName == 'checkbox') {
        content = <Checkbox {...props} />
    } else if (formName == 'stringdiv') {
        content = <StringDiv {...props} text={value} onInput={onInputHandler} />
        isValueSize = true;
        isValueCount = true;
    } else if (formName == 'string') {
        content = <String {...props} value={value} onInput={onInputHandler} />
        isValueSize = true;
        isValueCount = true;
    } else if (formName == 'stringvideo') {
        content = <StringVideo {...props} value={value} onInput={onInputHandler} />
    } else if (formName == 'texteditor') {
        content = <TextEditor {...props} value={value} onInput={(value, textPlain) => {
            setValue(value);

            if (typeof props.onInput === 'function') {
                props.onInput(value, textPlain);
            }
        }} />
        isValueSize = true;
        isValueCount = true;
    } else if (formName == 'textarea') {
        content = <Textarea {...props} value={value} onInput={onInputHandler} />
        isValueSize = true;
        isValueCount = true;
    } else if (formName == 'file' || formName == 'image' || formName == 'audio' || formName == 'video') {
        content = <File {...props} type={formName} onInput={event => onInputHandler(event.target.files, event)} />
        isValueSize = true;
        isValueCount = true;
    } else if (formName == 'switch') {
        content = <Switch {...props} />
    } else {
        content = <CustomField field={props} fields={props.customFieldsAll} />
    }

    if (isValueSize) {
        contentAppend.push(
            <ValueSize
                value={value}
                max={props.maxSize}
                show={props.showSize}
                onChange={props.onChangeSize}
            />
        )
    }

    if (isValueCount) {
        contentAppend.push(
            <ValueCount
                value={value}
                max={props.maxCount}
                show={props.showCount}
                splitter={props.splitter}
                onChange={props.onChangeCount}
            />
        )
    }

    return (
        <div className={className}>
            <Label text={props.label} />
            <Description text={props.description} />
            {content}
            {contentAppend.length > 0 ??
                <div className="size-count-wrap">{
                    contentAppend.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)
                }</div>
            }
            <InvalidText errors={props.errors} />
        </div>
    )
}

export default FieldGroup