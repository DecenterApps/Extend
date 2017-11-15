import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'setBalance':
      return accountActions[funcName](dispatch, payload);
    case 'clearPassword':
    case 'passwordReloader':
    case 'clearRefundValues':
      return accountActions[funcName](dispatch);
    case 'checkIfPasswordValid':
      return accountActions[funcName](getState, dispatch, payload);
    case 'send':
      return accountActions[funcName](web3, engine, getState, dispatch);
    case 'refund':
      return accountActions[funcName](web3, getState, dispatch, contracts);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
