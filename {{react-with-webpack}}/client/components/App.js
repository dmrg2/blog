import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import Content from './Content';
import Loading from './Loading';
import Write from './Write';
import Edit from './Edit';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div className="App">
        { /* Header with logo */ }
        <Header />
        { /* Content */ }
        <div className="Page">
          { /* Decide which page will be loaded */ }
          { (this.props.page === 'reading') && <Content /> }
          { (this.props.page === 'loading') && <Loading /> }
          { (this.props.page === 'writing') && <Write /> }
          { (this.props.page === 'editing') && <Edit /> }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    page: state.page,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
