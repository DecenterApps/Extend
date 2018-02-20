import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import GenerateNewPasswordForm from './GenerateNewPasswordForm';

import './generate-new-password.scss';

const GenerateNewPassword = ({ submittedGenerateNewPasswordForm }) => (
  <div styleName="generate-new-password-wrapper">
    <GenerateNewPasswordForm submitted={submittedGenerateNewPasswordForm} />
  </div>
);

GenerateNewPassword.propTypes = {
  submittedGenerateNewPasswordForm: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  submittedGenerateNewPasswordForm: state.account.submittedGenerateNewPasswordForm,
});

export default connect(GenerateNewPassword, mapStateToProps);
