import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import Content from './Content';
import Loading from './Loading';
import Write from './Write';
import Edit from './Edit';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Refresh from './Refresh';
import createBrowserHistory from 'history/createBrowserHistory';

class App extends Component {
  render() {
    const customHistory = createBrowserHistory();
    return (
      <Router history={customHistory}>
        <div className="App">
          {/* Header with logo */}
          <Header />
          {/* Content */}
          <div className="Page">
            {this.props.page === 'reading' && <Redirect to="/" />}
            {this.props.page === 'loading' && <Redirect to="/loading" />}
            {this.props.page === 'writing' && <Redirect to="/writing" />}
            {this.props.page === 'editing' && <Redirect to="/editing" />}
            {this.props.page === 'refresh' && <Redirect to="/refresh" />}
            {/* Decide which page will be loaded */}
            <Route exact path="/" component={Content} />
            <Route path="/loading" component={Loading} />
            <Route path="/writing" component={Write} />
            <Route path="/editing" component={Edit} />
            <Route path="/refresh" component={Refresh} />
          </div>
        </div>
      </Router>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
