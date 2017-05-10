import React, { Component } from 'react';
import {Editor, EditorState, RichUtils, Modifier, convertToRaw} from 'draft-js';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import colorStyleMap from './colorStyleMap';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as Helper from '../Helper';

class Write extends Component {
  constructor(props) {
    super(props);

    // This state is used for Draft js
    this.state = {
      editorState: EditorState.createEmpty(),
      titleState: EditorState.createEmpty(),
      url: '',
    };

    this.onChange = (editorState) => this.setState({editorState});
    this.onChangeTitle = (titleState) => this.setState({titleState});
    this.getBlockStyle = this.getBlockStyle.bind(this);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
    this.onURLChange = (e) => this.setState({url: e.target.value});
    this.readyAndWrite = this.readyAndWrite.bind(this);
  }

  /* Draft js related functions */
  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  _toggleColor(toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }
    this.onChange(nextEditorState);
  }

  // Convert Draft js's editorState to raw format
  // Then call writeHelper to write on Firebase
  // Once it is done, load contents in content page
  readyAndWrite() {
    const contentState = this.state.editorState.getCurrentContent();
    const contentStateTitle = this.state.titleState.getCurrentContent();

    // Check title is empty OR more than 80 characters OR only spaces
    if (contentStateTitle.hasText() && contentStateTitle.getPlainText().trim().length !== 0 && contentStateTitle.getPlainText().length<=80) {
      // Convert to raw format
      const rawContent = JSON.stringify(convertToRaw(contentState));
      const rawContentTitle = contentStateTitle.getPlainText();
      // -1 in order to make new post comes up top
      // contentNumber=1 will be higher (earlier) than contentNumber=2
      let contentNumber = this.props.contentNumber - 1;
      let time = new Date();
      let self = this;

      // Call writeHelper to write on Firebase
      Helper.writeHelper(contentNumber, rawContentTitle, rawContent, time.toString(), this.state.url)
      .then(function(response) {
        // Call readHelper to reload
        Helper.readHelper().then(function (response) {
          // Call ReadContent to render content page again
          self.props.ReadContent(response[0], response[1]);
        });
      });
    }
    else if (contentStateTitle.getPlainText().trim().length === 0){ alert("Please put title!"); }
    else if (contentStateTitle.getPlainText().length>80) { alert("Your title is too long!") }
  }

  render() {
    return (
      <div className="RichEditor-root">
        <div className="WriteGeneral">Title (Please put less than 80 characters)</div>
        <div className="WriteTitle" onClick={this.focus}>
          <Editor
            editorState={this.state.titleState}
            onChange={this.onChangeTitle}
            spellCheck={true}
          />
        </div>
        <div>
          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />
        </div>
        <div>
          <InlineStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>
        <div className='RichEditor-editor' onClick={this.focus}>
          <Editor
            blockStyleFn={this.getBlockStyle}
            editorState={this.state.editorState}
            onChange={this.onChange}
            spellCheck={true}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            customStyleMap={colorStyleMap}
          />
        </div>

        <div className='ImageInput'>
          <div className='ImageInputText'>Add Image (URL)</div>
          <input
            onChange={this.onURLChange}
            size="100"
            ref="url"
            type="text"
          />
        </div>

        <div className="WriteContentButton">
          <button type="button" className="ContentButton" onClick={()=>this.readyAndWrite()}>Save</button>
          <button type="button" className="ContentButton" onClick={this.props.ContentPage}>Cancel</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contentNumber: state.contentNumber,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    ReadContent: (contentAll, contentNumber) => dispatch(Actions.ReadContent(contentAll, contentNumber)),
    ContentPage: () => dispatch(Actions.ContentPage())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Write);
