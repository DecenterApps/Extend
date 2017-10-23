import * as pageActions from '../actions/pageActions';

const pageHandler = (web3, contract, getState, dispatch, funcName, payload, tabId) => {
  switch (funcName) {
    case 'checkIfUsernameVerified':
      return pageActions[funcName](web3, contract, payload, tabId);
    case 'tip':
      return pageActions[funcName](web3, contract, dispatch, getState);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default pageHandler;
