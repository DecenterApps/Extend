import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { createUserAuthMessage } from '../../../../messages/userActionsMessages';

import './register-username.scss';

const RegisterUsername = ({ registeringError, registeringUsername }) => (
  <div styleName="register-username-wrapper">
    {
      registeringError &&
      !registeringUsername &&
      <div styleName="error-wrapper">
        { registeringError }
      </div>
    }
    {
      !registeringUsername &&
      <button onClick={createUserAuthMessage} styleName="register-username">
        Register Reddit username
      </button>
    }
    {
      registeringUsername &&
      <div styleName="info-wrapper">
        We are verifying your Reddit username: { registeringUsername }. Awaiting confirmation.
      </div>
    }
  </div>
);

RegisterUsername.propTypes = {
  registeringError: PropTypes.string.isRequired,
  registeringUsername: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  registeringError: state.user.registeringError,
  registeringUsername: state.permanent.registeringUsername,
});

export default connect(RegisterUsername, mapStateToProps);
