import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import withdrawFormValidator from './withdrawFormValidator';
import { withdrawMessage } from '../../../../messages/accountActionMessages';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'withdrawForm';

class WithdrawForm extends Component {
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
          onSubmit={(e) => { this.props.handleSubmit(e, withdrawMessage); }}
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

          {
            this.props.withdrawingError &&
            <div className="submit-error">Error: {this.props.withdrawingError}</div>
          }

          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={
              this.props.pristine || this.props.invalid || this.props.withdrawing
            }
          >
            { this.props.withdrawing ? 'Withdrawing' : 'Withdraw' }
          </button>
        </form>
      </div>
    );
  }
}

WithdrawForm.propTypes = {
  formData: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  gasPrice: PropTypes.number.isRequired,
  withdrawing: PropTypes.bool.isRequired,
  withdrawingError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  withdrawing: state.account.withdrawing,
  withdrawingError: state.account.withdrawingError,
});

const ExportComponent = createForm(FORM_NAME, WithdrawForm, withdrawFormValidator);

export default connect(ExportComponent, mapStateToProps);
