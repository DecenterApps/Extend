import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../../customRedux/connect';
import createForm from '../../../../../customRedux/createForm';
import Tooltip from '../../../../../commonComponents/Tooltip/Tooltip';
import InfoIcon from '../../../../../commonComponents/Decorative/InfoIcon';
import createField from '../../../../../customRedux/createField';
import InputFormField from '../../../../../commonComponents/InputFormField';
import tipFormValidator from './tipFormValidator';
import { setTipFormTxPriceMessage } from '../../../../../messages/formsActionsMessages';
import { tipMessage } from '../../../../../messages/pageActionsMessages';

import formStyle from '../../../../../commonComponents/forms.scss';

const FORM_NAME = 'tipForm';

class TipForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(3);
    this.AmountField = createField(InputFormField, this.props.formData);
    this.GasPriceField = createField(InputFormField, this.props.formData);
    this.ReplyCheckbox = createField(InputFormField, this.props.formData, true);
  }

  componentDidMount() {
    setTipFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;

    const currentForm = this.props.forms[FORM_NAME];
    const newForm = newProps.forms[FORM_NAME];

    if (
      (Object.keys(newForm).length > 2 && Object.keys(currentForm).length > 2) &&
      ((newForm.gasPrice.value !== currentForm.gasPrice.value) ||
        (newForm.amount.value !== currentForm.amount.value) ||
        (newProps.balance !== this.props.balance))) {
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
    const { currentFormTxCost, insufficientBalance } = this.props.forms[FORM_NAME];

    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;
    const ReplyCheckbox = this.ReplyCheckbox;

    const submitDisabled = this.props.pristine || this.props.invalid ||
      this.props.sendingTip || (!this.props.invalid && insufficientBalance);

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, tipMessage); }}
      >
        {
          (this.props.isVerified === false) &&
          <div styleName="info-wrapper">
            The user you are trying to tip is not using ΞXTΞND yet. However, you can still send him a tip which he
            will then be able to claim after verifying his username. In the meantime, our smart contract will store
            the funds securely.
          </div>
        }

        <AmountField
          name="amount"
          showErrorText
          type="text"
          id="amount"
          showLabel
          labelText="Amount (ETH):"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
          autoFocus
        />

        <GasPriceField
          name="gasPrice"
          min="1"
          showErrorText
          showLabel
          labelText="Gas price (Gwei):"
          type="number"
          id="gasPrice"
          value={this.props.gasPrice}
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
        />

        <div styleName="notice-wrapper">
          <Tooltip
            content={`Uncheck if you do not want ${this.props.author} to receive a reply to the ${this.props.type}`}
            useDefaultStyles
          >
            <div styleName="notice-icon"><InfoIcon /></div>
          </Tooltip>

          <ReplyCheckbox
            name="reply"
            id="reply"
            showErrorText
            showLabel
            labelText={`Reply to ${this.props.type}:`}
            labelClass={formStyle.label}
            type="checkbox"
            value="true"
            checkBoxClass={formStyle.checkbox}
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={`${formStyle['form-item']} ${formStyle['form-item-checkbox']}`}
            errorClassName={formStyle['form-item-error']}
          />
        </div>

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
          this.props.sendingTipError &&
          <div styleName="submit-error">Error: {this.props.sendingTipError}</div>
        }

        {
          !this.props.invalid &&
          insufficientBalance &&
          <div styleName="submit-error">Insufficient balance for transaction</div>
        }

        {
          this.props.sendingTipSuccess &&
          <div styleName="submit-success">
            Tip successfully sent to the { this.props.isVerified ? 'user!' : 'contract.' }
          </div>
        }

        {
          !this.props.sendingTipSuccess &&
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
              { this.props.sendingTip ? 'Sending' : 'Send' }
            </Tooltip>
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
  forms: PropTypes.object.isRequired,
  sendingTipSuccess: PropTypes.bool.isRequired,
  isVerified: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  balance: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sendingTipError: state.user.sendingTipError,
  sendingTip: state.user.sendingTip,
  sendingTipSuccess: state.user.sendingTipSuccess,
  balance: state.account.balance,
  isVerified: state.modals.modalProps.isVerified,
  type: state.modals.modalProps.type,
  author: state.modals.modalProps.author
});

const ExportComponent = createForm(FORM_NAME, TipForm, tipFormValidator);

export default connect(ExportComponent, mapStateToProps);
