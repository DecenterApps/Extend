import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../../customRedux/connect';
import createForm from '../../../../../customRedux/createForm';
import createField from '../../../../../customRedux/createField';
import InputFormField from '../../../../../commonComponents/InputFormField';
import tipFormValidator from './tipFormValidator';
import { tipMessage } from '../../../../../messages/pageActionsMessages';

import formStyle from '../../../styles/forms.scss';

class TipForm extends Component {
  constructor(props) {
    super(props);

    this.AmountField = createField(InputFormField, props.formData);
    this.GasPriceField = createField(InputFormField, props.formData);
  }

  render() {
    const AmountField = this.AmountField;
    const GasPriceField = this.GasPriceField;

    return (
      <form
        styleName="form-wrapper"
        onSubmit={(e) => { this.props.handleSubmit(e, tipMessage); }}
      >

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
          type="text"
          value={this.props.gasPrice}
          wrapperClassName={formStyle['form-item-wrapper']}
          inputClassName={formStyle['form-item']}
          errorClassName={formStyle['form-item-error']}
        />

        {
          this.props.sendingTipError &&
          <div className="submit-error">Error: {this.props.sendingTipError}</div>
        }


        <button
          className={formStyle['submit-button']}
          type="submit"
          disabled={
            this.props.pristine || this.props.invalid ||
            this.props.sendingTip
          }
        >
          { this.props.sendingTip ? 'Sending' : 'Send' }
        </button>
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
};

const mapStateToProps = (state) => ({
  gasPrice: state.account.gasPrice,
  sendingTipError: state.user.sendingTipError,
  sendingTip: state.user.sendingTip
});

const ExportComponent = createForm('tipForm', TipForm, tipFormValidator);

export default connect(ExportComponent, mapStateToProps);
