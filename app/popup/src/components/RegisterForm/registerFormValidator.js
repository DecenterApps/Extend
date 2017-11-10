const registerFormValidator = (values) => {
  const errors = {};

  if (!values.gasPrice) errors.gasPrice = 'Required';

  if (values.gasPrice) {
    const nanError = isNaN(parseFloat(values.gasPrice));
    const toSmallError = !nanError && parseFloat(values.gasPrice) < 1;

    if (nanError) errors.gasPrice = 'The provided input is not a number';
    if (toSmallError) errors.gasPrice = 'Smallest amount is one gwei';
  }

  return errors;
};

export default registerFormValidator;
