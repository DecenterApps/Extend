import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { handleUserAuthenticationMessage } from '../../../../messages/dialogActionsMessages';

import './dialog.scss';

class Dialog extends Component {
  componentDidMount() {
    if (this.props.registeringUsername || this.props.verifiedUsername) return;

    handleUserAuthenticationMessage();
  }

  render() {
    return(
      <div styleName="dialog-wrapper">
        {
          !this.props.registeringUsername &&
          !this.props.verifiedUsername &&
          <div>
            <h1>
              Waiting for Reddit authentication
            </h1>
            {
              !this.props.registeringError &&
              <h2>
                A Reddit authentication window will pop up prompting you to log in. <br />
                This will link your Reddit username to your Extend Ethereum address.
              </h2>
            }
          </div>
        }
        {
          this.props.registeringUsername &&
          !this.props.verifiedUsername &&
          <div>
            <h1 styleName="success">Authentication successful!</h1>
            <h2>
              Your Reddit details have been submitted to the Extend smart contract for verification. <br />
              This might take a few minutes.
            </h2>
          </div>
        }
        {
          !this.props.registeringUsername &&
          this.props.verifiedUsername &&
          <div>
            <h1 styleName="success">Verification successful!</h1>
            <h2>
              You are now fully verified! Click on the extension icon to start using it.
            </h2>
          </div>
        }

        {
          this.props.registeringError &&
          <h2 styleName="error">{this.props.registeringError}</h2>
        }

        {
          (this.props.registeringUsername ||
          this.props.registeringError ||
          this.props.verifiedUsername) &&
          <p>
            <a onClick={() => chrome.windows.remove(this.props.dialogWindowId)}>You can now close this window.</a>
          </p>
        }
      </div>
    );
  }
}

Dialog.propTypes = {
  registeringUsername: PropTypes.string.isRequired,
  verifiedUsername: PropTypes.string.isRequired,
  registeringError: PropTypes.string.isRequired,
  dialogWindowId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  registeringUsername: state.permanent.registeringUsername,
  verifiedUsername: state.user.verifiedUsername,
  registeringError: state.user.registeringError,
  dialogWindowId: state.user.dialogWindowId,
});

export default connect(Dialog, mapStateToProps);
