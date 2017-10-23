import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addTipToPostsAndComments from '../Tip/addTipToPostsAndComments';

import './app.scss';

class App extends Component {
  componentDidMount() {
    addTipToPostsAndComments();
  }

  render() {
    return (
      <div styleName="page-app-wrapper">
        Modal
      </div>
    );
  }
}

App.propTypes = {
  id: PropTypes.string.isRequired
};

export default App;
