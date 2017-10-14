const generateNewPasswordFormValidator = (values) => {
  const errors = {};

  if (!values.password) errors.password = 'Required';
  if (!values.repeatPassword) errors.repeatPassword = 'Required';

  if (values.password && values.repeatPassword) {
    if (values.password !== values.repeatPassword) {
      errors.repeatPassword = 'Passwords do not match';
    }
  }

  return errors;
};

export default generateNewPasswordFormValidator;
