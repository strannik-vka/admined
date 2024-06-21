import React from "react";
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor, EditorState, RichUtils, CompositeDecorator } from 'draft-js';
import InvalidText from "../../shared/ui/form/InvalidText";

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

    onBlockTypeClick = (type) => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, type));
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
                this.props.onInput({
                    target: document.querySelector('#itemsForm [name="'+ this.props.name +'"]')
                });
            }
        });
    }

    render() {
        return (
            <>
                <div className="editor-btns">
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-one')}>H1</button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-two')}>H2</button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-three')}>H3</button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-four')}>H4</button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-five')}>H5</button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('header-six')}>H6</button>

                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('unordered-list-item')}><svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45001 1.57501H14.8M4.45001 5.60001H14.8M4.45001 9.62501H14.8" stroke="black" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.575 2.15C1.89256 2.15 2.15 1.89256 2.15 1.575C2.15 1.25744 1.89256 1 1.575 1C1.25744 1 1 1.25744 1 1.575C1 1.89256 1.25744 2.15 1.575 2.15Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.575 6.17499C1.89256 6.17499 2.15 5.91756 2.15 5.59999C2.15 5.28243 1.89256 5.02499 1.575 5.02499C1.25744 5.02499 1 5.28243 1 5.59999C1 5.91756 1.25744 6.17499 1.575 6.17499Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.575 10.2C1.89256 10.2 2.15 9.94255 2.15 9.62499C2.15 9.30742 1.89256 9.04999 1.575 9.04999C1.25744 9.04999 1 9.30742 1 9.62499C1 9.94255 1.25744 10.2 1.575 10.2Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    <button type="button" className="btn" onClick={() => this.onBlockTypeClick('ordered-list-item')}><svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.44998 2.57501H14.8M4.44998 6.60001H14.8M4.44998 10.625H14.8" stroke="black" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.29998 4V2.548L1.33998 1.96L0.867982 2.344L0.395982 2.716V1.972L1.47998 1.208H1.95998V4H1.29998ZM0.395982 4V3.46H2.61198V4H0.395982Z" fill="black" /><path d="M0.443982 8V7.548C0.787982 7.308 1.06398 7.09733 1.27198 6.916C1.48265 6.73467 1.63598 6.57467 1.73198 6.436C1.82798 6.29467 1.87598 6.16533 1.87598 6.048C1.87598 5.94133 1.84132 5.85733 1.77198 5.796C1.70265 5.73467 1.61465 5.704 1.50798 5.704C1.38265 5.704 1.27865 5.74667 1.19598 5.832C1.11332 5.91733 1.07465 6.032 1.07998 6.176H0.427982C0.430648 5.96533 0.478648 5.784 0.571982 5.632C0.665315 5.48 0.793315 5.364 0.955982 5.284C1.12132 5.20133 1.31065 5.16 1.52398 5.16C1.72398 5.16 1.90132 5.196 2.05598 5.268C2.21332 5.34 2.33598 5.44133 2.42398 5.572C2.51198 5.70267 2.55598 5.856 2.55598 6.032C2.55598 6.21067 2.51865 6.37733 2.44398 6.532C2.36932 6.68667 2.24932 6.84 2.08398 6.992C1.92132 7.14133 1.70532 7.29733 1.43598 7.46H2.55998V8H0.443982Z" fill="black" /><path d="M1.51198 12.048C1.30665 12.048 1.11998 12.008 0.951982 11.928C0.783982 11.8453 0.651982 11.7267 0.555982 11.572C0.459982 11.4173 0.417315 11.2307 0.427982 11.012H1.07998C1.07465 11.108 1.08932 11.1933 1.12398 11.268C1.15865 11.34 1.20932 11.396 1.27598 11.436C1.34265 11.476 1.42132 11.496 1.51198 11.496C1.62932 11.496 1.72398 11.4667 1.79598 11.408C1.87065 11.3467 1.90798 11.268 1.90798 11.172C1.90798 11.0947 1.88665 11.032 1.84398 10.984C1.80398 10.936 1.74798 10.9013 1.67598 10.88C1.60398 10.856 1.52132 10.844 1.42798 10.844H1.28798V10.304H1.43598C1.51065 10.304 1.57598 10.2907 1.63198 10.264C1.68798 10.2347 1.73065 10.196 1.75998 10.148C1.79198 10.0973 1.80798 10.0427 1.80798 9.984C1.80798 9.89067 1.77865 9.82133 1.71998 9.776C1.66132 9.728 1.58532 9.704 1.49198 9.704C1.37198 9.704 1.27598 9.74133 1.20398 9.816C1.13465 9.888 1.10265 9.984 1.10798 10.104H0.455982C0.455982 9.90933 0.501315 9.74267 0.591982 9.604C0.685315 9.46267 0.810648 9.35333 0.967982 9.276C1.12798 9.19867 1.30665 9.16 1.50398 9.16C1.70665 9.16 1.87998 9.192 2.02398 9.256C2.17065 9.31733 2.28265 9.404 2.35998 9.516C2.43998 9.628 2.47998 9.76133 2.47998 9.916C2.47998 10.012 2.46132 10.1013 2.42398 10.184C2.38932 10.264 2.33998 10.3333 2.27598 10.392C2.21465 10.4507 2.14265 10.4973 2.05998 10.532C2.16932 10.556 2.26265 10.6 2.33998 10.664C2.41998 10.728 2.48132 10.8053 2.52398 10.896C2.56665 10.9867 2.58798 11.084 2.58798 11.188C2.58798 11.356 2.54398 11.5053 2.45598 11.636C2.37065 11.764 2.24665 11.8653 2.08398 11.94C1.92398 12.012 1.73332 12.048 1.51198 12.048Z" fill="black" /></svg>
                    </button>

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