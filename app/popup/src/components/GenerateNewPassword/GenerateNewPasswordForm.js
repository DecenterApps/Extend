import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import connect from '../../../../customRedux/connect';
import InputFormField from '../../../../commonComponents/InputFormField';
import generateNewPasswordFormValidator from './generateNewPasswordFormValidator';
import { createWalletMessage } from '../../../../messages/accountActionMessages';

import formStyle from '../../styles/forms.scss';

class GenerateNewPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.PasswordField = createField(InputFormField, props.formData);
    this.RepeatPasswordField = createField(InputFormField, props.formData);
  }

  render() {
    const PasswordField = this.PasswordField;
    const RepeatPasswordField = this.RepeatPasswordField;

    return (
      <form
        styleName="form-wrapper"
        onSubmit={(e) => { this.props.handleSubmit(e, createWalletMessage); }}
      >
        {this.props.user}

        <PasswordField
          name="password"
          showErrorText
          placeholder="New password"
          type="password"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
        />

        <RepeatPasswordField
          name="repeatPassword"
          showErrorText
          placeholder="Repeat new password"
          type="password"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
        />

        <button
          className={formStyle['submit-button']}
          type="submit"
          disabled={
            this.props.pristine || this.props.invalid
          }
        >
          Submit
        </button>
      </form>
    );
  }
}

GenerateNewPasswordForm.propTypes = {
  user: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user.address
});

const ExportComponent = createForm(
  'generateNewPasswordForm', GenerateNewPasswordForm, generateNewPasswordFormValidator
);

export default connect(ExportComponent, mapStateToProps);
