import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return accountActions[funcName](web3, dispatch, payload);
    case 'setBalance':
      return accountActions[funcName](dispatch, payload);
    case 'copiedSeed':
    case 'passwordReloader':
    case 'clearPassword':
      return accountActions[funcName](dispatch);
    case 'checkIfPasswordValid':
      return accountActions[funcName](getState, dispatch, payload);
    case 'createUserAuth': {
      return accountActions[funcName](contract, web3, getState, dispatch);
    }

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
