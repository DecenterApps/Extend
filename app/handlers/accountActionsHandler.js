import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return accountActions[funcName](web3, engine, dispatch, getState, payload);
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
      return accountActions[funcName](web3, engine, getState, dispatch);
    case 'withdraw':
    case 'refund':
      return accountActions[funcName](web3, getState, dispatch, contracts);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
