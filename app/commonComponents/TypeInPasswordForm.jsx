import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import connect from '../customRedux/connect';
import createForm from '../customRedux/createForm';
import createField from '../customRedux/createField';
import InputFormField from './InputFormField';
import typeInPasswordFormValidator from './typeInPasswordFormValidator';
import { checkIfPasswordValidMessage } from '../messages/keyStoreActionMessages';

import formStyle from './forms.scss';

const FORM_NAME = 'TypeInPasswordForm';

class TypeInPasswordForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(1);
    this.PasswordField = createField(InputFormField, this.props.formData);
  }

  render() {
    const PasswordField = this.PasswordField;

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, checkIfPasswordValidMessage); }}
      >

        <PasswordField
          name="password"
          showErrorText
          showLabel
          labelText="Passphrase:"
          type="password"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
          autoFocus
        />

        {
          this.props.unlockError.length > 0 &&
          <div styleName="submit-error">{ this.props.unlockError }</div>
        }

        <button
          className={formStyle['submit-button']}
          type="submit"
          disabled={
            !this.props.formData.getFiledVal('password')
          }
        >
          <Tooltip
            content="No password"
            useHover={!this.props.formData.getFiledVal('password')}
            useDefaultStyles
          >
          Submit
          </Tooltip>
        </button>
      </form>
    );
  }
}

TypeInPasswordForm.propTypes = {
  formData: PropTypes.object.isRequired,
  unlockError: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  unlockError: state.account.unlockError,
  test: state.keyStore.address
});

const ExportComponent = createForm(
  FORM_NAME, TypeInPasswordForm, typeInPasswordFormValidator
);

export default connect(ExportComponent, mapStateToProps);
