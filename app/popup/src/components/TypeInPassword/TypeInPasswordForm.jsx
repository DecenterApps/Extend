import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../.././../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import typeInPasswordFormValidator from './typeInPasswordFormValidator';
import { checkIfPasswordValidMessage } from '../../../../messages/accountActionMessages';

import formStyle from '../../../../commonComponents/forms.scss';

class TypeInPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.PasswordField = createField(InputFormField, props.formData);
  }

  render() {
    const PasswordField = this.PasswordField;

    return (
      <form
        styleName="form-wrapper"
        onSubmit={(e) => { this.props.handleSubmit(e, checkIfPasswordValidMessage); }}
      >

        <PasswordField
          name="password"
          showErrorText
          placeholder="Enter password"
          type="password"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
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
          Submit
        </button>
      </form>
    );
  }
}

TypeInPasswordForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  unlockError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  unlockError: state.account.unlockError,
  test: state.account.address
});

const ExportComponent = createForm(
  'TypeInPasswordForm', TypeInPasswordForm, typeInPasswordFormValidator
);

export default connect(ExportComponent, mapStateToProps);
