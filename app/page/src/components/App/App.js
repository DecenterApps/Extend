import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addTipToPostsAndComments from '../Tip/addTipToPostsAndComments';
import connect from '../../../../customRedux/connect';

import './app.scss';

class App extends Component {
  componentDidMount() {
    addTipToPostsAndComments();
  }

  render() {
    return (
      <div styleName={`page-app-wrapper ${this.props.modalOpen ? 'open' : ''}`}>
        Modal
        {
          this.props.modalOpen && <h1>OPEN</h1>
        }
      </div>
    );
  }
}

App.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  modalOpen: state.modals.modalType.length > 0,
});

export default connect(App, mapStateToProps);
