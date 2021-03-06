import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import { sendMessage } from '../../../../messages/accountActionMessages';
import { setSendFormTxPriceMessage } from '../../../../messages/formsActionsMessages';
import sendFormValidator from './sendFormValidator';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'sendForm';

class SendForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(3);
    this.AddressField = createField(InputFormField, this.props.formData);
    this.AmountField = createField(InputFormField, this.props.formData);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  componentDidMount() {
    setSendFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;

    const currentForm = this.props.forms[FORM_NAME];
    const newForm = newProps.forms[FORM_NAME];

    if (
      (Object.keys(newForm).length > 2 && Object.keys(currentForm).length > 2) &&
      ((newForm.gasPrice.value !== currentForm.gasPrice.value) ||
       (newForm.to.value !== currentForm.to.value) ||
        (newForm.amount.value !== currentForm.amount.value) ||
        (newProps.balance !== this.props.balance))) {
      setSendFormTxPriceMessage();
    }
  }

  render() {
    const { currentFormTxCost, insufficientBalance } = this.props.forms[FORM_NAME];

    const AddressField = this.AddressField;
    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;

    const submitDisabled = this.props.pristine || this.props.invalid || this.props.sending ||
      (!this.props.invalid && insufficientBalance);

    return (
      <div>
        <form
          styleName="form-wrapper-2"
          onSubmit={(e) => { this.props.handleSubmit(e, sendMessage); }}
        >

          <AddressField
            name="to"
            showErrorText
            showLabel
            labelText="To:"
            type="text"
            wrapperClassName={`${formStyle['form-item-wrapper']} ${formStyle['form-item-wrapper-long']}`}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
            autoFocus
          />

          <AmountField
            name="amount"
            showErrorText
            showLabel
            labelText="Amount (ETH):"
            type="text"
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
          />

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

          {
            this.props.sendingError &&
            <div styleName="submit-error">Error: {this.props.sendingError}</div>
          }

          {
            !this.props.invalid &&
            insufficientBalance &&
            <div styleName="submit-error">Insufficient balance for transaction</div>
          }

          {
            this.props.sendingSuccess &&
            <div styleName="submit-success margin">
              Transaction successfully sent.
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
              useHover={
                this.props.pristine || this.props.invalid || (!this.props.invalid && insufficientBalance)
              }
              useDefaultStyles
            >
              { this.props.sending ? 'Transferring' : 'Transfer' }
            </Tooltip>
          </button>
        </form>
      </div>
    );
  }
}

SendForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  gasPrice: PropTypes.number.isRequired,
  sending: PropTypes.bool.isRequired,
  sendingError: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  sendingSuccess: PropTypes.bool.isRequired,
  forms: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sending: state.account.sending,
  sendingError: state.account.sendingError,
  balance: state.account.balance,
  sendingSuccess: state.account.sendingSuccess
});

const ExportComponent = createForm(FORM_NAME, SendForm, sendFormValidator);

export default connect(ExportComponent, mapStateToProps);
