import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import createForm from '../../../../customRedux/createForm';
import createField from '../../../../customRedux/createField';
import InputFormField from '../../../../commonComponents/InputFormField';
import { sendMessage } from '../../../../messages/accountActionMessages';
import sendFormValidator from './sendFormValidator';

import formStyle from '../../../../commonComponents/forms.scss';

const FORM_NAME = 'sendForm';

class SendForm extends Component {
  constructor(props) {
    super(props);

    this.AddressField = createField(InputFormField, props.formData);
    this.AmountField = createField(InputFormField, props.formData);
    this.GasPriceField = createField(InputFormField, props.formData);
  }

  render() {
    const AddressField = this.AddressField;
    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;

    return (
      <div>
        <form
          styleName="form-wrapper"
          onSubmit={(e) => { this.props.handleSubmit(e, sendMessage); }}
        >

          <AddressField
            name="to"
            showErrorText
            placeholder="Address to send to"
            type="text"
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
          />

          <AmountField
            name="amount"
            showErrorText
            placeholder="Amount of Eth that you want to tip"
            type="text"
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
          />

          <GasPriceField
            name="gasPrice"
            showErrorText
            placeholder="Transaction gas price"
            type="number"
            value={this.props.gasPrice}
            wrapperClassName={formStyle['form-item-wrapper']}
            inputClassName={formStyle['form-item']}
            errorClassName={formStyle['form-item-error']}
          />

          {
            this.props.sendingError &&
            <div className="submit-error">Error: {this.props.sendingError}</div>
          }


          <button
            className={formStyle['submit-button']}
            type="submit"
            disabled={
              this.props.pristine || this.props.invalid || this.props.sending
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
  sendingError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sending: state.account.sending,
  sendingError: state.account.sendingError,
});

const ExportComponent = createForm(FORM_NAME, SendForm, sendFormValidator);

export default connect(ExportComponent, mapStateToProps);
