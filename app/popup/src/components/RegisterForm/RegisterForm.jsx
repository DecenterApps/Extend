import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import withdrawFormValidator from '../Withdraw/withdrawFormValidator';
import { createUserAuthMessage } from '../../../../messages/userActionsMessages';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'registerForm';

class RegisterForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(1);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  render() {
    const GasPriceField = this.GasPriceField;

    return (
      <div>
        <form
          styleName="form-wrapper-2"
          onSubmit={(e) => { this.props.handleSubmit(e, createUserAuthMessage); }}
        >

          <GasPriceField
            name="gasPrice"
            showErrorText
            showLabel
            labelText="Gas price (Gwei):"
            type="number"
            value={this.props.gasPrice}
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
                <span>
                  { this.props.pristine && 'Form has not been touched' }
                  { this.props.invalid && 'Form is not valid, check errors' }
                </span>
              )}
              useHover={this.props.pristine || this.props.invalid}
              useDefaultStyles
            >
              Register Reddit username
            </Tooltip>
          </button>
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  gasPrice: PropTypes.number.isRequired,

};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
});

const ExportComponent = createForm(FORM_NAME, RegisterForm, withdrawFormValidator);

export default connect(ExportComponent, mapStateToProps);
