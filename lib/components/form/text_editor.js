import React from "react";
import { Editor, EditorState } from 'draft-js';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Editor, {
      name: this.props.name,
      editorState: this.state.editorState,
      onChange: this.props.onChange
    }));
  }

}

export default TextEditor;