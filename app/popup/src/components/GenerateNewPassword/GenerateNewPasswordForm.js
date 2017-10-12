import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createField from '../../../../customRedux/Field';
import connect from '../../../../customRedux/connect';
import InputFormField from '../../../../commonComponents/InputFormField';
import createForm from '../../../../customRedux/createForm';
import generateNewPasswordFormValidator from './generateNewPasswordFormValidator';

// const formStyle = require('./forms.scss');

class GenerateNewPasswordForm extends Component { // eslint-disable-line
  render() {
    const PasswordField = createField(InputFormField);
    const RepeatPasswordField = createField(InputFormField);

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
  user: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user.address
});

// const validate = generateNewPasswordFormValidator;
//
GenerateNewPasswordForm = createForm('generateNewPasswordFrom', GenerateNewPasswordForm); // eslint-disable-line

export default connect(GenerateNewPasswordForm, mapStateToProps);
