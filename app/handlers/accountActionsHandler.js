import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return accountActions[funcName](web3, dispatch, payload);
    case 'setBalance':
      return accountActions[funcName](dispatch, payload);
    case 'copiedSeed':
    case 'clearPassword':
    case 'passwordReloader':
    case 'clearRefundValues':
      return accountActions[funcName](dispatch);
    case 'checkIfPasswordValid':
      return accountActions[funcName](getState, dispatch, payload);
    case 'send':
      return accountActions[funcName](web3, getState, dispatch);
    case 'withdraw':
    case 'refund':
      return accountActions[funcName](web3, getState, dispatch, contracts);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
