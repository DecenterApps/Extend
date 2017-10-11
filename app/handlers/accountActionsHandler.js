import * as accountActions from '../actions/accountActions';

const accountActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return accountActions[funcName]();

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default accountActionsHandler;
