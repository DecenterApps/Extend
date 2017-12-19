import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../../commonComponents/Tooltip/Tooltip';
import connect from '../../../../../customRedux/connect';
import createForm from '../../../../../customRedux/createForm';
import createField from '../../../../../customRedux/createField';
import InfoIcon from '../../../../../commonComponents/Decorative/InfoIcon';
import InputFormField from '../../../../../commonComponents/InputFormField';
import buyGoldFormValidator from './buyGoldFormValidator';
import { buyGoldMessage } from '../../../../../messages/pageActionsMessages';
import { setBuyGoldFormTxPriceMessage } from '../../../../../messages/formsActionsMessages';

import formStyle from '../../../../../commonComponents/forms.scss';

const FORM_NAME = 'buyGoldForm';

class buyGoldForm extends Component {
  componentWillMount() {
    this.currentFormTxCost = {};
    this.insufficientBalance = true;

    this.props.formData.setNumOfFields(3);
    this.MonthsField = createField(InputFormField, this.props.formData);
    this.GasPriceField = createField(InputFormField, this.props.formData);
    this.ReplyCheckbox = createField(InputFormField, this.props.formData, true);
  }

  componentDidMount() {
    setBuyGoldFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;

    const currentForm = this.props.forms[FORM_NAME];
    const newForm = newProps.forms[FORM_NAME];

    if (Object.keys(newForm).length > 2 && Object.keys(currentForm).length > 2) {
      if ((newForm.gasPrice.value !== currentForm.gasPrice.value) ||
        (newForm.months.value !== currentForm.months.value) ||
        (newProps.balance !== this.props.balance)) {
        setBuyGoldFormTxPriceMessage();
      }

      if (newForm.currentFormTxCost.months === newForm.months.value) {
        this.currentFormTxCost = newForm.currentFormTxCost;
        this.insufficientBalance = newForm.insufficientBalance;
      }
    }

    if (
      newProps.buyingGoldSuccess &&
      !this.props.buyingGoldSuccess
    ) {
      setTimeout(this.props.closeModal, 3000);
    }
  }

  render() {
    const { insufficientBalance, currentFormTxCost } = this;

    const MonthsField = this.MonthsField;
    const GasPriceField = this.GasPriceField;
    const ReplyCheckbox = this.ReplyCheckbox;

    const submitDisabled = this.props.pristine || this.props.invalid || this.props.buyingGold ||
      (!this.props.invalid && insufficientBalance);

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, buyGoldMessage); }}
      >

        <MonthsField
          name="months"
          min="1"
          id="months"
          showErrorText
          showLabel
          labelText="Number of Months:"
          type="number"
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
          value="1"
        />

        <GasPriceField
          name="gasPrice"
          min="1"
          id="gasPrice"
          showErrorText
          showLabel
          labelText="Gas price (Gwei):"
          type="number"
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
          Object.keys(currentFormTxCost).length > 2 &&
          <div styleName="tx-info">
            <span>Max transaction cost:</span>
            <div>
              <span>{ currentFormTxCost.eth } ETH</span>
              <span styleName="second-price">{ currentFormTxCost.usd } USD</span>
            </div>
          </div>
        }

        {
          this.props.buyingGoldError &&
          <div styleName="submit-error">Error: {this.props.buyingGoldError}</div>
        }

        {
          !this.props.invalid &&
          currentFormTxCost.eth &&
          insufficientBalance &&
          <div styleName="submit-error">Insufficient balance for transaction</div>
        }

        {
          this.props.buyingGoldSuccess &&
          <div styleName="submit-success">
            Gold request successfully sent!
          </div>
        }


        {
          !this.props.buyingGoldSuccess &&
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
              {this.props.buyingGold ? 'Buying' : 'Buy'}
            </Tooltip>
          </button>
        }
      </form>
    );
  }
}

buyGoldForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  gasPrice: PropTypes.number.isRequired,
  buyingGold: PropTypes.bool.isRequired,
  buyingGoldError: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  buyingGoldSuccess: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  balance: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  buyingGold: state.user.buyingGold,
  buyingGoldError: state.user.buyingGoldError,
  buyingGoldSuccess: state.user.buyingGoldSuccess,
  balance: state.account.balance,
  type: state.modals.modalProps.type,
  author: state.modals.modalProps.author
});

const ExportComponent = createForm(
  FORM_NAME, buyGoldForm, buyGoldFormValidator
);

export default connect(ExportComponent, mapStateToProps);
