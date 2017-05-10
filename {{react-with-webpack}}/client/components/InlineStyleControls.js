import React, { Component } from 'react';
import StyleButton from './StyleButton';

class InlineStyleControls extends Component {
  render() {
    var INLINE_STYLES = [
      {label: 'Bold', style: 'BOLD'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'},
      {label: 'Red', style: 'red'},
      {label: 'Orange', style: 'orange'},
      {label: 'Yellow', style: 'yellow'},
      {label: 'Green', style: 'green'},
      {label: 'Blue', style: 'blue'},
      {label: 'Indigo', style: 'indigo'},
      {label: 'Violet', style: 'violet'},
    ];

    var currentStyle = this.props.editorState.getCurrentInlineStyle();
    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={this.props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  }
}

export default InlineStyleControls;
