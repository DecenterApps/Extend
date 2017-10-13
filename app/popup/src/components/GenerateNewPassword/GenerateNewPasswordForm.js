import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import connect from '../../../../customRedux/connect';
import InputFormField from '../../../../commonComponents/InputFormField';
import generateNewPasswordFormValidator from './generateNewPasswordFormValidator';

// const formStyle = require('./forms.scss');

class GenerateNewPasswordForm extends Component { // eslint-disable-line
  constructor(props) {
    super(props);

    this.PasswordField = createField(InputFormField, props.formData);
    this.RepeatPasswordField = createField(InputFormField, props.formData);
  }

  render() {
    const PasswordField = this.PasswordField;
    const RepeatPasswordField = this.RepeatPasswordField;

    return (
      <form>
        {this.props.user}

        <PasswordField
          name="password"
          showErrorText
          placeholder="New password"
          type="text"
          wrapperClassName="form-item-wrapper"
          inputClassName="form-item"
          errorClassName="form-item-error"
        />

        <RepeatPasswordField
          name="repeatPassword"
          showErrorText
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
  }
}

GenerateNewPasswordForm.propTypes = {
  user: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user.address
});

const ExportComponent = createForm(
  'generateNewPasswordForm', GenerateNewPasswordForm, generateNewPasswordFormValidator
);

export default connect(ExportComponent, mapStateToProps);
