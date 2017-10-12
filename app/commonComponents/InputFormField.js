import React from 'react';
import PropTypes from 'prop-types';

const InputFormField = ({
  input, placeholder, wrapperClassName, inputClassName, errorClassName, showErrorText,
  type, id, showLabel, labelText, labelClass, meta: { touched, error }, onChangeAction
}) => (
  <div className={wrapperClassName}>
    <input
      {...input}
      placeholder={placeholder}
      id={id || ''}
      className={`${inputClassName} ${touched && error ? errorClassName : ''}`}
      type={type}
      onChange={(event) => { onChangeAction(event.target.value); input.onChange(event); }}
    />
    {showLabel && <label className={labelClass} htmlFor={id || ''}>{ labelText }</label>}
    {touched && ((error && showErrorText && <div className={errorClassName}>{error}</div>))}
  </div>
);

InputFormField.defaultProps = {
  showLabel: false,
  labelText: '',
  labelClass: '',
  id: '',
  placeholder: '',
  showErrorText: false,
  onChangeAction: () => {}
};

InputFormField.propTypes = {
  input: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  wrapperClassName: PropTypes.string.isRequired,
  inputClassName: PropTypes.string.isRequired,
  errorClassName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  showLabel: PropTypes.bool,
  labelText: PropTypes.string,
  labelClass: PropTypes.string,
  meta: PropTypes.object.isRequired,
  showErrorText: PropTypes.bool,
  onChangeAction: PropTypes.func,
};

export default InputFormField;
