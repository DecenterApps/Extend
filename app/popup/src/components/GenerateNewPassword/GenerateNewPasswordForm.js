import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import InputFormField from '../../../../commonComponents/InputFormField';
import generateNewPasswordFormValidator from './generateNewPasswordFormValidator';

// const formStyle = require('./forms.scss');

let GenerateNewPasswordForm = ({ user }) => (
  <form onSubmit={this.props.handleSubmit}>
    { user }
    <Field
      name="password"
      showErrorText
      component={InputFormField}
      placeholder="New password"
      type="text"
      wrapperClassName="form-item-wrapper"
      inputClassName="form-item"
      errorClassName="form-item-error"
    />

    <Field
      name="repeatPassword"
      showErrorText
      component={InputFormField}
      placeholder="Repeat new password"
      type="text"
      wrapperClassName="form-item-wrapper"
      inputClassName="form-item"
      errorClassName="form-item-error"
    />

    <button>
      Submit
    </button>
  </form>
);

GenerateNewPasswordForm.propTypes = {
  user: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user.address
});

const validate = generateNewPasswordFormValidator;

GenerateNewPasswordForm = reduxForm({ form: 'GenerateNewPasswordForm', validate })(GenerateNewPasswordForm); // eslint-disable-line

export default connect(GenerateNewPasswordForm, mapStateToProps);
