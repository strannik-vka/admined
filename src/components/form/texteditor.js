import React from "react";
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, RichUtils, CompositeDecorator, ContentState, convertFromHTML } from 'draft-js';

class TextEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(this.props.value)),
                new CompositeDecorator([{
                    strategy: (contentBlock, callback, contentState) => {
                        contentBlock.findEntityRanges((character) => {
                            const entityKey = character.getEntity();
                            return (
                                entityKey !== null &&
                                contentState.getEntity(entityKey).getType() === 'LINK'
                            );
                        }, callback);
                    },
                    component: (props) => {
                        const { url } = props.contentState.getEntity(props.entityKey).getData();

                        return (
                            <a href={url} title={url}>
                                {props.children}
                            </a>
                        );
                    }
                }])
            ),
            value: this.props.value
        }
    }

    onAddUrlClick = () => {
        const url = prompt('Введите ссылку', '');

        if (url) {
            const contentState = this.state.editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity('LINK', 'SEGMENTED',
                { url: url }
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(this.state.editorState, { currentContent: contentStateWithEntity });

            this.onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
        }
    }

    onDelUrlClick = () => {
        const selection = this.state.editorState.getSelection();

        if (!selection.isCollapsed()) {
            this.onChange(RichUtils.toggleLink(this.state.editorState, selection, null));
        }
    }

    onUnderlineClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    onBoldClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    onItalicClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    onChange = (editorState) => {
        this.setState({
            editorState,
            value: stateToHTML(this.state.editorState.getCurrentContent(), {
                entityStyleFn: (entity) => {
                    if (entity.get('type').toLowerCase() === 'link') {
                        return {
                            element: 'a',
                            attributes: {
                                href: entity.getData().url,
                                target: '_blank'
                            }
                        };
                    }
                }
            })
        }, () => {
            if (typeof this.props.onChange === 'function') {
                this.props.onChange();
            }
        });
    }

    render() {
        return (
            <>
                <div className="editor-btns">
                    <button type="button" className="btn" onClick={this.onUnderlineClick}>U</button>
                    <button type="button" className="btn" onClick={this.onBoldClick}><b>B</b></button>
                    <button type="button" className="btn" onClick={this.onItalicClick}><em>I</em></button>
                    <button type="button" className="btn" onClick={this.onAddUrlClick}>Добавить ссылку</button>
                    <button type="button" className="btn" onClick={this.onDelUrlClick}>Удалить ссылку</button>
                </div>
                <div className={this.props.errors ? 'form-control editor is-invalid' : 'form-control editor'}>
                    <Editor
                        placeholder={this.props.placeholder}
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                    />
                </div>
                <textarea
                    name={this.props.name}
                    value={this.state.value}
                    onChange={() => { }}
                    style={{ display: 'none' }}
                ></textarea>
                {
                    this.props.errors
                        ? <div className="invalid-feedback">{this.props.errors[0]}</div>
                        : ''
                }
            </>
        );
    }

}

export default TextEditor;