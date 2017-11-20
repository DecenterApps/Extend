import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
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

    const currentForm = this.props.forms[FORM_NAME];
    const newForm = newProps.forms[FORM_NAME];

    if (
      (Object.keys(newForm).length > 2 && Object.keys(currentForm).length > 2) &&
      ((newForm.gasPrice.value !== currentForm.gasPrice.value) ||
        (newProps.balance !== this.props.balance))) {
      setRefundFormTxPriceMessage();
    }
  }

  render() {
    const { currentFormTxCost, insufficientBalance } = this.props.forms[FORM_NAME];

    const GasPriceField = this.GasPriceField;

    const submitDisabled = this.props.pristine || this.props.invalid || this.props.refunding ||
      !this.props.refundAvailable || (!this.props.invalid && insufficientBalance);

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
              { this.props.refundTipUsername }
            </a>
          </div>

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
            this.props.refundAvailable &&
            <div styleName="tx-info">
              <span>Max transaction cost:</span>
              <div>
                <span>{ currentFormTxCost.eth } ETH</span>
                <span styleName="second-price">{ currentFormTxCost.usd } USD</span>
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
            insufficientBalance &&
            <div styleName="submit-error">Insufficient balance for transaction</div>
          }

          {
            this.props.refundingSuccess &&
            <div styleName="submit-success margin">
              Refund request successfully sent to the contract.
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
              { this.props.refunding ? 'Refunding' : 'Refund' }
            </Tooltip>
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
  forms: PropTypes.object.isRequired,
  refundTipUsername: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  refunding: state.account.refunding,
  refundingError: state.account.refundingError,
  refundingSuccess: state.account.refundingSuccess,
  refundAvailable: state.account.refundAvailable,
  refundTipUsername: state.account.refundTipUsername,
  balance: state.account.balance,
});

const ExportComponent = createForm(FORM_NAME, RefundForm, refundFormValidator);

export default connect(ExportComponent, mapStateToProps);
