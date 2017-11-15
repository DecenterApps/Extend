import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { createUserAuthMessage } from '../../../../messages/userActionsMessages';

import './register-username.scss';

const RegisterUsername = ({ registering, registeringError, registeringUsername }) => (
  <div styleName="register-username-wrapper">
    {
      registeringError &&
      !registering &&
      <div styleName="error-wrapper">
        { registeringError }
      </div>
    }
    {
      !registering &&
      <button onClick={createUserAuthMessage} styleName="register-username">
        Register Reddit username
      </button>
    }
    {
      registering &&
      <div styleName="info-wrapper">
        We are verifying your Reddit username: { registeringUsername }. Awaiting confirmation.
      </div>
    }
  </div>
);

RegisterUsername.propTypes = {
  registeringError: PropTypes.string.isRequired,
  registering: PropTypes.bool.isRequired,
  registeringUsername: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  registering: state.permanent.registering,
  registeringError: state.permanent.registeringError,
  registeringUsername: state.user.registeringUsername,
});

export default connect(RegisterUsername, mapStateToProps);
