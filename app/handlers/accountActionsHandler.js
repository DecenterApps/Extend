import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'setBalance':
    case 'setRefundFormValues':
      return accountActions[funcName](dispatch, payload);
    case 'clearRefundValues':
    case 'clearSendValues':
      return accountActions[funcName](dispatch);
    case 'send':
      return accountActions[funcName](web3, engine, getState, dispatch);
    case 'refund':
      return accountActions[funcName](web3, getState, dispatch, contracts);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
