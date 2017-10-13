const generateNewPasswordFormValidator = (values) => {
  console.log('VALUE', values);
  const errors = {};

  if (!values.password) errors.password = 'Required';
  if (!values.repeatPassword) errors.repeatPassword = 'Required';

  return errors;
};

export default generateNewPasswordFormValidator;
