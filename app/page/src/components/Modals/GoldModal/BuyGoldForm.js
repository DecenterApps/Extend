import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import connect from '../../../../../customRedux/connect';
import createForm from '../../../../../customRedux/createForm';
import createField from '../../../../../customRedux/createField';
import InputFormField from '../../../../../commonComponents/InputFormField';
import buyGoldFormValidator from './buyGoldFormValidator';
import { buyGoldMessage } from '../../../../../messages/pageActionsMessages';
import { setBuyGoldFormTxPriceMessage } from '../../../../../messages/formsActionsMessages';

import formStyle from '../../../../../commonComponents/forms.scss';

const FORM_NAME = 'buyGoldForm';

class buyGoldForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(1);
    this.MonthsField = createField(InputFormField, this.props.formData);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;
    if (!this.props.form) return;
    if (Object.keys(this.props.form).length === 0) return;

    if (
      (newProps.form.gasPrice.value !== this.props.form.gasPrice.value) ||
      (newProps.form.months.value !== this.props.form.months.value)
    ) {
      setBuyGoldFormTxPriceMessage();
    }
  }

  render() {
    const MonthsField = this.MonthsField;
    const GasPriceField = this.GasPriceField;

    return (
      <form
        styleName="form-wrapper-2"
        onSubmit={(e) => { this.props.handleSubmit(e, buyGoldMessage); }}
      >

        <MonthsField
          name="months"
          showErrorText
          showLabel
          labelText="Number of Months:"
          type="number"
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
            <span>Max transaction cost:</span>
            <div>
              <span>{ this.props.currentFormTxCost.eth } ETH</span>
              <span styleName="second-price">{ this.props.currentFormTxCost.usd } USD</span>
            </div>
          </div>
        }

        {
          this.props.buyingGoldError &&
          <div styleName="submit-error">Error: {this.props.buyingGoldError}</div>
        }

        {
          !this.props.invalid &&
          this.props.insufficientBalance &&
          <div styleName="submit-error">Insufficient balance for transaction</div>
        }

        {
          this.props.buyingGoldSuccess &&
          <div styleName="submit-success">
            Tip successfully sent to the contract.
          </div>
        }

        <button
          className={formStyle['submit-button']}
          type="submit"
          disabled={
            this.props.pristine ||
            this.props.invalid ||
            this.props.buyingGold ||
            this.props.insufficientBalance
          }
        >
          <Tooltip
            content={(
              <span>
                { this.props.pristine && 'Form has not been touched' }
                { this.props.invalid && 'Form is not valid, check errors' }
                { this.props.buyingGold && 'Sending transaction' }
              </span>
            )}
            useHover={this.props.pristine || this.props.invalid || this.props.buyingGold}
            useDefaultStyles
          >
            { this.props.buyingGold ? 'Submitting' : 'Submit' }
          </Tooltip>
        </button>
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
  currentFormTxCost: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  buyingGoldSuccess: PropTypes.bool.isRequired,
  insufficientBalance: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  buyingGold: state.user.buyingGold,
  buyingGoldError: state.user.buyingGoldError,
  currentFormTxCost: state.forms.currentFormTxCost,
  form: state.forms[FORM_NAME],
  buyingGoldSuccess: state.user.buyingGoldSuccess,
  insufficientBalance: state.forms.insufficientBalance
});

const ExportComponent = createForm(
  FORM_NAME, buyGoldForm, buyGoldFormValidator
);

export default connect(ExportComponent, mapStateToProps);
