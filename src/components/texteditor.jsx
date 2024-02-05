import React from "react";
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor, EditorState, RichUtils, CompositeDecorator } from 'draft-js';
import InvalidText from "../forms/InvalidText";

class TextEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createWithContent(
                stateFromHTML(this.props.value ? this.props.value : ''),
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
            value: stateToHTML(editorState.getCurrentContent(), {
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
            if (typeof this.props.onInput === 'function') {
                this.props.onInput();
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
                    <button type="button" className="btn svg" onClick={this.onAddUrlClick}><svg width="228" height="452" viewBox="0 0 228 452" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M210 274L210 338C210 363.461 199.886 387.879 181.882 405.882C163.879 423.886 139.461 434 114 434C88.5392 434 64.1212 423.886 46.1178 405.882C28.1143 387.879 18 363.461 18 338L18 274M18 178L18 114C18 88.5392 28.1143 64.1212 46.1178 46.1177C64.1212 28.1142 88.5392 18 114 18C139.461 18 163.879 28.1142 181.882 46.1177C199.886 64.1212 210 88.5392 210 114L210 178M114 318.71L114 131.29" stroke="black" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    <button type="button" className="btn" onClick={this.onDelUrlClick}><svg width="338" height="452" viewBox="0 0 338 452" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M266 274L266 338C266 363.461 255.886 387.879 237.882 405.882C219.879 423.886 195.461 434 170 434C144.539 434 120.121 423.886 102.118 405.882C84.1143 387.879 74 363.461 74 338L74 274M74 178L74 114C74 88.5392 84.1143 64.1212 102.118 46.1177C120.121 28.1142 144.539 18 170 18C195.461 18 219.879 28.1142 237.882 46.1177C255.886 64.1212 266 88.5392 266 114L266 178M170 318.71L170 131.29" stroke="black" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" /><line x1="12.7279" y1="69.272" x2="324.728" y2="381.272" stroke="black" strokeWidth="36" /></svg></button>
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
                <InvalidText errors={this.props.errors} />
            </>
        );
    }

}

export default TextEditor;