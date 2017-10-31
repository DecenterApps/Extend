import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { connectAgainMessage } from '../../../../messages/userActionsMessages';

import './network-unavailable.scss';

const NetworkUnavailable = ({ connectingAgain, connectingAgainError }) => (
  <div styleName="network-unavailable-wrapper">
    There was a problem connecting to the Ethereum network, please try again.

    { connectingAgainError && <div styleName="error-msg">{ connectingAgainError }</div> }

    <button
      disabled={connectingAgain}
      onClick={connectAgainMessage}
    >
      Connect
    </button>
  </div>
);

NetworkUnavailable.propTypes = {
  connectingAgain: PropTypes.bool.isRequired,
  connectingAgainError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  connectingAgain: state.user.connectingAgain,
  connectingAgainError: state.user.connectingAgainError
});

export default connect(NetworkUnavailable, mapStateToProps);
