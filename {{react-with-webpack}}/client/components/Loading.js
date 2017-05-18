import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Loading extends Component {
  render() {
    return (
      <div>
        No blog yet. Please write one.
        <Link to="/writing">
          <button className="WriteButton" type="button">
            Write Something New
          </button>
        </Link>
      </div>
    );
  }
}

export default Loading;
