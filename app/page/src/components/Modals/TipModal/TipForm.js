import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../../customRedux/connect';
import createForm from '../../../../../customRedux/createForm';
import createField from '../../../../../customRedux/createField';
import InputFormField from '../../../../../commonComponents/InputFormField';
import tipFormValidator from './tipFormValidator';
import { setTipFormTxPriceMessage } from '../../../../../messages/formsActionsMessages';
import { tipMessage } from '../../../../../messages/pageActionsMessages';

import formStyle from '../../../../../commonComponents/forms.scss';

const FORM_NAME = 'tipForm';

class TipForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(2);
    this.AmountField = createField(InputFormField, this.props.formData);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  componentDidMount() {
    setTipFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;
    if (!this.props.form) return;
    if (Object.keys(this.props.form).length === 0) return;

    if (
      (newProps.form.gasPrice.value !== this.props.form.gasPrice.value) ||
      (newProps.form.amount.value !== this.props.form.amount.value) ||
      (newProps.balance !== this.props.balance)
    ) {
      setTipFormTxPriceMessage();
    }

    if (
      newProps.sendingTipSuccess &&
      !this.props.sendingTipSuccess
    ) {
      setTimeout(this.props.closeModal, 3000);
    }
  }

  render() {
    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, tipMessage); }}
      >

        <AmountField
          name="amount"
          showErrorText
          type="text"
          showLabel
          labelText="Amount (ETH):"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
          autoFocus
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
            <span>Max transaction cost:</span>
            <div>
              <span>{ this.props.currentFormTxCost.eth } ETH</span>
              <span styleName="second-price">{ this.props.currentFormTxCost.usd } USD</span>
            </div>
          </div>
        }

        {
          this.props.sendingTipError &&
          <div styleName="submit-error">Error: {this.props.sendingTipError}</div>
        }

        {
          !this.props.invalid &&
          this.props.insufficientBalance &&
          <div styleName="submit-error">Insufficient balance for transaction</div>
        }

        {
          this.props.sendingTipSuccess &&
          <div styleName="submit-success">
            Tip successfully sent to the contract.
          </div>
        }

        {
          !this.props.sendingTipSuccess &&
          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={
              this.props.pristine || this.props.invalid ||
              this.props.sendingTip || this.props.insufficientBalance
            }
          >
            { this.props.sendingTip ? 'Sending' : 'Send' }
          </button>
        }
      </form>
    );
  }
}

TipForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  sendingTip: PropTypes.bool.isRequired,
  sendingTipError: PropTypes.string.isRequired,
  gasPrice: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
  currentFormTxCost: PropTypes.object.isRequired,
  sendingTipSuccess: PropTypes.bool.isRequired,
  insufficientBalance: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sendingTipError: state.user.sendingTipError,
  sendingTip: state.user.sendingTip,
  form: state.forms[FORM_NAME],
  currentFormTxCost: state.forms.currentFormTxCost,
  sendingTipSuccess: state.user.sendingTipSuccess,
  insufficientBalance: state.forms.insufficientBalance,
  balance: state.account.balance
});

const ExportComponent = createForm(FORM_NAME, TipForm, tipFormValidator);

export default connect(ExportComponent, mapStateToProps);
