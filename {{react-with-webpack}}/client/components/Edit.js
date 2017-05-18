import React, { Component } from 'react';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  Modifier,
  convertFromRaw,
  convertToRaw
} from 'draft-js';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import colorStyleMap from './colorStyleMap';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import * as Helper from '../Helper';
import { Link } from 'react-router-dom';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      titleState: EditorState.createEmpty(),
      url: ''
    };
    this.onChange = editorState => this.setState({ editorState });
    this.onChangeTitle = titleState => this.setState({ titleState });

    this.getBlockStyle = this.getBlockStyle.bind(this);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.toggleInlineStyle = style => this._toggleInlineStyle(style);
    this.toggleColor = toggledColor => this._toggleColor(toggledColor);
    this.onURLChange = e => this.setState({ url: e.target.value });
    this.readyAndUpdate = this.readyAndUpdate.bind(this);
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
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
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote';
      default:
        return null;
    }
  }

  _toggleColor(toggledColor) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();

    const nextContentState = Object.keys(
      colorStyleMap
    ).reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color);
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

  readyAndUpdate() {
    const contentState = this.state.editorState.getCurrentContent();
    const contentStateTitle = this.state.titleState.getCurrentContent();

    // Check title is empty OR more than 80 characters OR only spaces
    if (
      contentStateTitle.hasText() &&
      contentStateTitle.getPlainText().trim().length !== 0 &&
      contentStateTitle.getPlainText().length <= 80
    ) {
      const rawContent = JSON.stringify(convertToRaw(contentState));
      const rawContentTitle = contentStateTitle.getPlainText();
      let time = new Date();
      let self = this;

      Helper.updateHelper(
        this.props.id,
        rawContentTitle,
        rawContent,
        time.toString(),
        this.state.url
      ).then(function(response) {
        // Call readHelper to reload
        Helper.readHelper().then(function(response) {
          // Call ReadContent to render content page again
          self.props.ReadContent(response[0], response[1]);
        });
      });
    } else if (contentStateTitle.getPlainText().trim().length === 0) {
      alert('Please put title!');
    } else if (contentStateTitle.getPlainText().length > 80) {
      alert('Your title is too long!');
    }
  }

  // Using props to set eidtorState of title and content (also URL)
  componentWillMount() {
    if (this.props.contentAll[this.props.id].title !== undefined) {
      const contentState = convertFromRaw(
        JSON.parse(this.props.contentAll[this.props.id].content)
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState: editorState });

      const titleState = EditorState.createWithContent(
        ContentState.createFromText(this.props.contentAll[this.props.id].title)
      );
      this.setState({ titleState: titleState });

      this.setState({ url: this.props.contentAll[this.props.id].url });
    }
  }

  render() {
    let className = 'RichEditor-editor';
    var contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <div className="WriteGeneral">
          Title (Please put less than 80 characters)
        </div>
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
        <div className={className} onClick={this.focus}>
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

        <div className="ImageInput">
          <div className="ImageInputText">Image (URL)</div>
          <input
            onChange={this.onURLChange}
            size="100"
            ref="url"
            type="text"
            value={this.state.url}
            onKeyDown={this.onURLInputKeyDown}
          />
        </div>

        <div className="WriteContentButton">
          <button
            type="button"
            className="ContentButton"
            onClick={() => this.readyAndUpdate()}
          >
            Save
          </button>
          <Link to="/">
            <button type="button" className="ContentButton">
              Cancel
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contentAll: state.contentAll,
    id: state.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ReadContent: (contentAll, contentNumber) =>
      dispatch(Actions.ReadContent(contentAll, contentNumber))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
