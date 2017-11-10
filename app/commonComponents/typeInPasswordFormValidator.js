const generateNewPasswordFormValidator = (values) => {
  const errors = {};

  if (!values.password) errors.password = 'Required';

  return errors;
};

export default generateNewPasswordFormValidator;
