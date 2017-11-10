const buyGoldFormValidator = (values) => {
  const errors = {};

  if (!values.months) errors.months = 'Required';
  if (!values.gasPrice) errors.gasPrice = 'Required';

  if (values.months) {
    const numMonths = parseFloat(values.months);
    const nanError = isNaN(numMonths);
    const toSmallError = numMonths <= 0;
    const toLargeError = numMonths > 36;

    if (nanError) errors.months = 'The provided input is not a number';
    if (toSmallError) errors.months = 'Shortest duration is 1 month';
    if (toLargeError) errors.months = 'Longest duration is 36 months';
  }

  if (values.gasPrice) {
    const nanError = isNaN(parseFloat(values.gasPrice));
    const toSmallError = !nanError && parseFloat(values.gasPrice) < 1;

    if (nanError) errors.gasPrice = 'The provided input is not a number';
    if (toSmallError) errors.gasPrice = 'Smallest amount is one gwei';
  }

  return errors;
};

export default buyGoldFormValidator;
