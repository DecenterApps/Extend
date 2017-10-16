import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return accountActions[funcName](dispatch, payload);
    case 'copiedSeed':
    case 'passwordReloader':
    case 'clearPassword':
      return accountActions[funcName](dispatch);
    case 'checkIfPasswordValid':
      return accountActions[funcName](getState, dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
