import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import refundFormValidator from './refundFormValidator';
import { setRefundFormTxPriceMessage } from '../../../../messages/formsActionsMessages';
import { refundMessage } from '../../../../messages/accountActionMessages';
import { createRedditLink } from '../../../../actions/utils';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'refundForm';

class RefundForm extends Component {
  componentWillMount() {
    this.props.formData.setNumOfFields(1);
    this.GasPriceField = createField(InputFormField, this.props.formData);
  }

  componentDidMount() {
    setRefundFormTxPriceMessage();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.invalid) return;
    if (!this.props.form) return;
    if (Object.keys(this.props.form).length === 0) return;
    if (
      (newProps.form.gasPrice.value !== this.props.form.gasPrice.value) ||
      (newProps.balance !== this.props.balance)) {
      setRefundFormTxPriceMessage();
    }
  }

  render() {
    const GasPriceField = this.GasPriceField;

    return (
      <div>
        <form
          styleName="form-wrapper-2"
          onSubmit={(e) => { this.props.handleSubmit(e, refundMessage); }}
        >

          <div styleName="form-item-display">
            <span>Refund from:</span>
            <a
              href={createRedditLink(this.props.refundTipUsername)}
              target="_blank"
              rel="noopener noreferrer"
            >
              /u/{ this.props.refundTipUsername }
            </a>
          </div>

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
            this.props.refundAvailable &&
            <div styleName="tx-info">
              <span>Max transaction fee:</span>
              <div>
                <span>{ this.props.currentFormTxCost.eth } ETH</span>
                <span styleName="second-price">{ this.props.currentFormTxCost.usd } USD</span>
              </div>
            </div>
          }

          {
            this.props.refundingError &&
            <div styleName="submit-error">Error: {this.props.refundingError}</div>
          }
          {
            !this.props.refundAvailable &&
            <div styleName="submit-error">Error: Refund not available from this user</div>
          }
          {
            !this.props.invalid &&
            this.props.insufficientBalance &&
            <div styleName="submit-error">Insufficient balance for transaction</div>
          }

          {
            this.props.refundingSuccess &&
            <div styleName="submit-success">
              Refund request successfully sent to the contract
            </div>
          }

          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={
              this.props.pristine || this.props.invalid || this.props.refunding || !this.props.refundAvailable ||
              this.props.insufficientBalance
            }
          >
            { this.props.refunding ? 'Refunding' : 'Refund' }
          </button>
        </form>
      </div>
    );
  }
}

RefundForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  gasPrice: PropTypes.number.isRequired,
  refunding: PropTypes.bool.isRequired,
  refundingError: PropTypes.string.isRequired,
  refundingSuccess: PropTypes.bool.isRequired,
  refundAvailable: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  currentFormTxCost: PropTypes.object.isRequired,
  refundTipUsername: PropTypes.string.isRequired,
  insufficientBalance: PropTypes.bool.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  refunding: state.account.refunding,
  refundingError: state.account.refundingError,
  refundingSuccess: state.account.refundingSuccess,
  refundAvailable: state.account.refundAvailable,
  form: state.forms[FORM_NAME],
  currentFormTxCost: state.forms.currentFormTxCost,
  refundTipUsername: state.user.refundTipUsername,
  balance: state.account.balance,
  insufficientBalance: state.forms.insufficientBalance,
});

const ExportComponent = createForm(FORM_NAME, RefundForm, refundFormValidator);

export default connect(ExportComponent, mapStateToProps);
