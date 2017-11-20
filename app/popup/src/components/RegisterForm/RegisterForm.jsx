import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import registerFormValidator from './registerFormValidator';
import { openAuthWindowMessage } from '../../../../messages/userActionsMessages';
import { setRegisterFormTxPriceMessage } from '../../../../messages/formsActionsMessages';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'registerForm';

class RegisterForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(1);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  componentDidMount() {
    setRegisterFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;

    const currentForm = this.props.forms[FORM_NAME];
    const newForm = newProps.forms[FORM_NAME];

    if (
      (Object.keys(newForm).length > 2 && Object.keys(currentForm).length > 2) &&
      ((newForm.gasPrice.value !== currentForm.gasPrice.value) ||
      (newProps.balance !== this.props.balance))) {
      setRegisterFormTxPriceMessage();
    }
  }

  render() {
    const { currentFormTxCost, insufficientBalance } = this.props.forms[FORM_NAME];

    const GasPriceField = this.GasPriceField;
    const submitDisabled = this.props.pristine || this.props.invalid ||
      (!this.props.invalid && insufficientBalance);

    return (
      <div>
        <form
          styleName="form-wrapper-2"
          onSubmit={(e) => { this.props.handleSubmit(e, openAuthWindowMessage); }}
        >

          <GasPriceField
            name="gasPrice"
            min="1"
            showErrorText
            showLabel
            labelText="Gas price (Gwei):"
            type="number"
            value={this.props.gasPrice}
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
          />

          {
            !this.props.invalid &&
            <div styleName="tx-info">
              <span>Max transaction cost:</span>
              <div>
                <span>{ currentFormTxCost.eth } ETH</span>
                <span styleName="second-price">{ currentFormTxCost.usd } USD</span>
              </div>
            </div>
          }

          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={submitDisabled}
          >
            <Tooltip
              content={(
                <div>
                  { this.props.pristine && 'Fill out missing form fields' }
                  { !this.props.pristine && this.props.invalid && 'Form is incomplete or has errors' }
                  { !this.props.invalid && insufficientBalance && 'Insufficient balance for transaction' }
                </div>
              )}
              useHover={submitDisabled}
              useDefaultStyles
            >
              VERIFY USERNAME
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
  forms: PropTypes.object.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  balance: state.account.balance
});

const ExportComponent = createForm(FORM_NAME, RegisterForm, registerFormValidator);

export default connect(ExportComponent, mapStateToProps);
