import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import ModalRoot from '../Modals/ModalRoot';
import addTipToPostsAndComments from '../Tip/addTipToPostsAndComments';
import removeTipToPostsAndComments from '../Tip/removeTipToPostsAndComments';
import removeGoldFromPostsAndComments from '../BuyGold/removeGoldFromPostsAndComments';
import addGoldToPostsAndComments from '../BuyGold/addGoldToPostsAndComments';

class App extends Component {
  componentWillMount() {
    if (this.props.generatedVault && this.props.copiedSeed && this.props.password) {
      addTipToPostsAndComments();
      addGoldToPostsAndComments();
      this.added = true;
      this.removed = false;
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.generatedVault && newProps.copiedSeed && newProps.password && !this.added) {
      addTipToPostsAndComments();
      this.added = true;
      this.removed = false;
    }

    if (!newProps.password && this.added && !this.removed) {
      removeTipToPostsAndComments();
      removeGoldFromPostsAndComments();
      this.added = false;
      this.removed = true;
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
