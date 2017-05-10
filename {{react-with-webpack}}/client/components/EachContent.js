import React, { Component } from 'react';
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import { connect } from 'react-redux';
import * as Actions from '../actions/Actions';
import colorStyleMap from './colorStyleMap';
import fb from '../Firebase';
import * as Helper from '../Helper';

class EachContent extends Component {
  constructor(props) {
    super(props);

    // This state is used for Draft js
    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.timeFormatter = this.timeFormatter.bind(this);
    this.getBlockStyle = this.getBlockStyle.bind(this);
    this.removeContent = this.removeContent.bind(this);
  }

  componentWillMount() {
    // Check if there is any content. If there is, render it!
    if (this.props.contentAll[this.props.id].title !== undefined) {
      const contentState = convertFromRaw(JSON.parse(this.props.contentAll[this.props.id].content));
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState: editorState});
    }
  }

  timeFormatter () {
    let time = new Date(this.props.contentAll[this.props.id].time);
    let date = time.toDateString();
    let hour = time.getHours();
    let min = time.getMinutes();
    let am = 'am';
    if (hour === 0) { hour = "12"; }
    else if (hour === 12) { am = 'pm'; }
    else if (hour > 12) {
      am = 'pm';
      hour %= 12;
    }
    if (min<10) {
      min = '0' + min;
    }
    return `${date} (${hour}:${min} ${am})`;
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  removeContent(id) {
    let self = this;
    fb.database().ref('ids/' + id).remove()
    .then(Helper.readHelper().then(function (response) { self.props.ReadContent(response[0], response[1]); }));
  }

  render() {
    return (
      <div className="EachContent" id={this.props.id}>
        <div className="EachContentButton">
          <button type="button" className="ContentButton" onClick={()=>this.props.EditPage(this.props.id)}>Edit</button>
          <button type="button" className="ContentButton" onClick={()=>this.removeContent(this.props.id)}>Remove</button>
        </div>
        <div className="EachContentTitle">{this.props.contentAll[this.props.id].title}</div>
        <div className="EachContentTime">{this.timeFormatter()}</div>
        <div className="EachContentImage">{this.props.contentAll[this.props.id].url && <img src={this.props.contentAll[this.props.id].url} alt='blogImage' />}</div>
        <div className="RichEditor-editor-edit RichEditor-root-edit">
          <Editor
            blockStyleFn={this.getBlockStyle}
            editorState={this.state.editorState}
            customStyleMap={colorStyleMap}
            readOnly={true}
          />
        </div>
        <div className="EachContentButton">
          <button type="button" className="ContentButton" onClick={()=>this.props.EditPage(this.props.id)}>Edit</button>
          <button type="button" className="ContentButton" onClick={()=>this.removeContent(this.props.id)}>Remove</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contentAll: state.contentAll,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    ReadContent: (contentAll, contentNumber) => dispatch(Actions.ReadContent(contentAll, contentNumber)),
    EditPage: (id) => dispatch(Actions.EditPage(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EachContent);
