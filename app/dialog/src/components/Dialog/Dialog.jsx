import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { handleUserAuthenticationMessage } from '../../../../messages/dialogActionsMessages';

import './dialog.scss';

class Dialog extends Component {
  componentDidMount() {
    handleUserAuthenticationMessage();
  }

  render() {
    return(
      <div styleName="dialog-wrapper">
        {
          !this.props.registering &&
          !this.props.verifiedUsername &&
          <div>
            <h1>
              Connecting to Reddit
            </h1>
            <h2>
              A confirmation window will pop up. <br />
              This will allow the extension to verify your Reddit identity.
            </h2>
          </div>
        }
        {
          this.props.registering &&
          !this.props.verifiedUsername &&
          <div>
            <h1 styleName="success">Success</h1>
            <h2>
              Successfully connected to Reddit. <br />
              Verification was sent to the contract.
              After a couple of minutes, check the extension popup to see if verified.
            </h2>
          </div>
        }
        {
          !this.props.registering &&
          this.props.verifiedUsername &&
          <div>
            <h1 styleName="success">Success</h1>
            <h2>
              You are now fully verified, check extension popup for more info.
            </h2>
          </div>
        }
        {
          (this.props.registering ||
          this.props.verifiedUsername) &&
          <p>
            <a onClick={() => chrome.windows.remove(this.props.dialogWindowId)}>You can close this window.</a>
          </p>
        }
        {
          this.props.registeringError &&
          <h2 styleName="error">{this.props.registeringError}</h2>
        }
      </div>
    );
  }
}

Dialog.propTypes = {
  registering: PropTypes.bool.isRequired,
  verifiedUsername: PropTypes.string.isRequired,
  registeringError: PropTypes.string.isRequired,
  dialogWindowId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  registering: state.user.registering,
  verifiedUsername: state.user.verifiedUsername,
  registeringError: state.user.registeringError,
  dialogWindowId: state.user.dialogWindowId,
});

export default connect(Dialog, mapStateToProps);
