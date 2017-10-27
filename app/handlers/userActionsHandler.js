import * as userActions from '../actions/userActions';

const userActionsHandler = (web3, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'acceptPrivacyNotice':
      return userActions[funcName](dispatch);

    case 'createUserAuth':
      return userActions[funcName](contracts, web3, getState, dispatch);

    case 'setTab':
    case 'changeView':
      return userActions[funcName](dispatch, payload);

    case 'getSentTips':
    case 'getReceivedTips':
      return userActions[funcName](web3, contracts.events, dispatch, getState);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default userActionsHandler;
