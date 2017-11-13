import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
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

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;
    if (!this.props.form) return;
    if (Object.keys(this.props.form).length === 0) return;

    if (
      (newProps.form.gasPrice.value !== this.props.form.gasPrice.value) ||
      (newProps.form.to.value !== this.props.form.to.value) ||
      (newProps.form.amount.value !== this.props.form.amount.value)
    ) {
      setSendFormTxPriceMessage();
    }
  }

  render() {
    const AddressField = this.AddressField;
    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;
    const insufficientBalance =
      !this.props.invalid && (((parseFloat(this.props.balance) - parseFloat(this.props.currentFormTxCost.eth)) < 0));

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
              <span>Max transaction fee:</span>
              <div>
                <span>{ this.props.currentFormTxCost.eth } ETH</span>
                <span styleName="second-price">{ this.props.currentFormTxCost.usd } USD</span>
              </div>
            </div>
          }

          {
            this.props.sendingError &&
            <div styleName="submit-error">Error: {this.props.sendingError}</div>
          }

          {
            insufficientBalance &&
            <div styleName="submit-error">Insufficient balance for transaction</div>
          }

          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={
              this.props.pristine || this.props.invalid || this.props.sending || insufficientBalance
            }
          >
            { this.props.sending ? 'Sending' : 'Send' }
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
  form: PropTypes.object.isRequired,
  currentFormTxCost: PropTypes.object.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sending: state.account.sending,
  sendingError: state.account.sendingError,
  form: state.forms[FORM_NAME],
  currentFormTxCost: state.forms.currentFormTxCost,
  balance: state.account.balance
});

const ExportComponent = createForm(FORM_NAME, SendForm, sendFormValidator);

export default connect(ExportComponent, mapStateToProps);
