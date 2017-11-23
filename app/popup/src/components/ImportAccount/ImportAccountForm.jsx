import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import importAccountFormValidator from './importAccountFormValidator';
import { importAccountMessage } from '../../../../messages/keyStoreActionMessages';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'importAccount';

class ImportAccountForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(2);
    this.SeedField = createField(InputFormField, this.props.formData);
    this.PasswordField = createField(InputFormField, this.props.formData);
  }

  render() {
    const SeedField = this.SeedField;
    const PasswordField = this.PasswordField;

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, importAccountMessage); }}
      >
        <SeedField
          name="seed"
          showErrorText
          inputType="textarea"
          showLabel
          labelText="Recovery phrase:"
          wrapperClassName={`${formStyle['form-item-wrapper']} ${formStyle['form-item-wrapper-long']} ${formStyle['form-item-wrapper-align-top']}`} // eslint-disable-line
          inputClassName={formStyle['form-item']}
          errorClassName={`${formStyle['form-item-error']} ${formStyle['form-item-error-textarea']}`}
          autoFocus
        />

        <PasswordField
          name="password"
          showErrorText
          type="password"
          showLabel
          labelText="New passphrase:"
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
          <Tooltip
            content={(
              <div>
                { this.props.pristine && 'Fill out missing form fields' }
                { !this.props.pristine && this.props.invalid && 'Form is incomplete or has errors' }
              </div>
            )}
            useHover={this.props.pristine || this.props.invalid}
            useDefaultStyles
          >
            Submit
          </Tooltip>
        </button>
      </form>
    );
  }
}

ImportAccountForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default createForm(
  FORM_NAME, ImportAccountForm, importAccountFormValidator
);
