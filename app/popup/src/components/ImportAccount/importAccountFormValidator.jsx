import lightwallet from 'eth-lightwallet';

const keyStore = lightwallet.keystore;

const generateNewPasswordFormValidator = (values) => {
  const errors = {};

  if (!values.seed) errors.seed = 'Required';
  if (!values.password) errors.password = 'Required';

  if (values.seed && !keyStore.isSeedValid(values.seed)) errors.seed = 'Recovery phrase is not valid';

  return errors;
};

export default generateNewPasswordFormValidator;
