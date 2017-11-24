import React, { Component } from 'react';
import PropTypes from 'prop-types';


class InputFormField extends Component {
  componentDidMount() {
    if (!this.props.value) return;

    this.props.input.onInput({ target: { value: this.props.value } });
  }

  render() {
    const {
      input, placeholder, wrapperClassName, inputClassName, errorClassName, showErrorText, min,
      type, id, showLabel, labelText, labelClass, meta: { touched, error }, value, autoFocus,
      inputType
    } = this.props;
    return (
      <div className={wrapperClassName}>
        {
          inputType === 'input' &&
          <input
            {...input}
            defaultValue={value}
            placeholder={placeholder}
            id={id}
            className={`${inputClassName} ${touched && error ? errorClassName : ''}`}
            type={type}
            autoFocus={autoFocus}
            min={min}
          />
        }
        {
          inputType === 'textarea' &&
          <textarea
            {...input}
            style={{ resize: 'none' }}
            defaultValue={value}
            placeholder={placeholder}
            id={id}
            className={`${inputClassName} ${touched && error ? errorClassName : ''}`}
            autoFocus={autoFocus}
          />
        }

        {showLabel && <label className={labelClass} htmlFor={id || ''}>{ labelText }</label>}
        {touched && ((error && showErrorText && <div className={errorClassName}>{error}</div>))}
      </div>
    );
  }
}

InputFormField.defaultProps = {
  value: '',
  showLabel: false,
  labelText: '',
  labelClass: '',
  id: '',
  placeholder: '',
  showErrorText: false,
  autoFocus: false,
  min: '',
  type: 'text',
  inputType: 'input'
};

InputFormField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  input: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  wrapperClassName: PropTypes.string.isRequired,
  inputClassName: PropTypes.string.isRequired,
  errorClassName: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.string,
  showLabel: PropTypes.bool,
  labelText: PropTypes.string,
  labelClass: PropTypes.string,
  meta: PropTypes.object.isRequired,
  showErrorText: PropTypes.bool,
  autoFocus: PropTypes.bool,
  min: PropTypes.string,
  inputType: PropTypes.string
};

export default InputFormField;
