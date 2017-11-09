import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import ModalRoot from '../Modals/ModalRoot';
import addTipToPostsAndComments from '../Tip/addTipToPostsAndComments';
import addGoldToPostsAndComments from '../BuyGold/addGoldToPostsAndComments';
import addUserVerifiedToPostsAndComments from '../UserVerified/addUserVerifiedToPostsAndComments';

class App extends Component {
  componentWillMount() {
    if (this.props.generatedVault && this.props.copiedSeed && this.props.password) {
      addTipToPostsAndComments();
      addGoldToPostsAndComments();
      addUserVerifiedToPostsAndComments();
      this.added = true;
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.generatedVault && newProps.copiedSeed && newProps.password && !this.added) {
      addTipToPostsAndComments();
      addGoldToPostsAndComments();
      addUserVerifiedToPostsAndComments();
      this.added = true;
    }
  }

  render() {
    return(
      <ModalRoot />
    );
  }
}

App.propTypes = {
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  generatedVault: state.account.created,
  password: state.account.password,
  copiedSeed: state.account.copiedSeed,
});

export default connect(App, mapStateToProps);
