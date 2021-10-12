import React from "react";
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, RichUtils, CompositeDecorator, ContentState, convertFromHTML } from 'draft-js';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.value)), new CompositeDecorator([{
        strategy: (contentBlock, callback, contentState) => {
          contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
          }, callback);
        },
        component: props => {
          const {
            url
          } = props.contentState.getEntity(props.entityKey).getData();
          return /*#__PURE__*/React.createElement("a", {
            href: url,
            title: url
          }, props.children);
        }
      }])),
      value: this.props.value
    };
  }

  onAddUrlClick = () => {
    const url = prompt('Введите ссылку', '');

    if (url) {
      const contentState = this.state.editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('LINK', 'SEGMENTED', {
        url: url
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(this.state.editorState, {
        currentContent: contentStateWithEntity
      });
      this.onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
    }
  };
  onDelUrlClick = () => {
    const selection = this.state.editorState.getSelection();

    if (!selection.isCollapsed()) {
      this.onChange(RichUtils.toggleLink(this.state.editorState, selection, null));
    }
  };
  onUnderlineClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  };
  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };
  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  };
  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };
  onChange = editorState => {
    this.setState({
      editorState,
      value: stateToHTML(this.state.editorState.getCurrentContent(), {
        entityStyleFn: entity => {
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
  };

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "editor-btns"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn",
      onClick: this.onUnderlineClick
    }, "U"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn",
      onClick: this.onBoldClick
    }, /*#__PURE__*/React.createElement("b", null, "B")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn",
      onClick: this.onItalicClick
    }, /*#__PURE__*/React.createElement("em", null, "I")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn",
      onClick: this.onAddUrlClick
    }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn",
      onClick: this.onDelUrlClick
    }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443")), /*#__PURE__*/React.createElement("div", {
      className: this.props.errors ? 'form-control editor is-invalid' : 'form-control editor'
    }, /*#__PURE__*/React.createElement(Editor, {
      placeholder: this.props.placeholder,
      editorState: this.state.editorState,
      handleKeyCommand: this.handleKeyCommand,
      onChange: this.onChange
    })), /*#__PURE__*/React.createElement("textarea", {
      name: this.props.name,
      value: this.state.value,
      onChange: () => {},
      style: {
        display: 'none'
      }
    }), this.props.errors ? /*#__PURE__*/React.createElement("div", {
      className: "invalid-feedback"
    }, this.props.errors[0]) : '');
  }

}

export default TextEditor;