import React from 'react';
import GenerateNewPasswordForm from './GenerateNewPasswordForm';

import './generate-new-password.scss';

const GenerateNewPassword = () => (
  <div styleName="generate-new-password-wrapper">
    <h1>Generate new password</h1>
    <GenerateNewPasswordForm />
  </div>
);

export default GenerateNewPassword;
