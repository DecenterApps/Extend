import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { handleUserAuthenticationMessage } from '../../../../messages/dialogActionsMessages';

class Dialog extends Component {
  componentDidMount() {
    handleUserAuthenticationMessage();
  }

  render() {
    return(
      <div>
        {
          !this.props.registering &&
          !this.props.verifiedUsername &&
          <div>
            Authenticating new user with Reddit.
          </div>
        }
        {
          this.props.registering &&
          !this.props.verifiedUsername &&
          <div>
            Successfully verified new user with Reddit. Verification was sent to the contract.
            After a couple of minutes, check the extension popup to see if verified.
          </div>
        }
        {
          !this.props.registering &&
          this.props.verifiedUsername &&
          <div>You are now fully verified, check extension popup for more info.</div>
        }
        {
          this.props.registeringError && <div>Error occurred while verifying.</div>
        }
      </div>
    );
  }
}

Dialog.propTypes = {
  registering: PropTypes.bool.isRequired,
  verifiedUsername: PropTypes.string.isRequired,
  registeringError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  registering: state.user.registering,
  verifiedUsername: state.user.verifiedUsername,
  registeringError: state.user.registeringError
});

export default connect(Dialog, mapStateToProps);
