import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';

class Refresh extends Component {
  render() {
    if (this.props.page === 'reading') {
      history.push('/');
    }
    return (
      <div>
        Loading
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    page: state.page
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Refresh);
