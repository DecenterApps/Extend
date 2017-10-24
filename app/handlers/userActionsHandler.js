import * as userActions from '../actions/userActions';

const userActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'acceptPrivacyNotice': {
      return userActions[funcName](dispatch);
    }
    case 'createUserAuth': {
      return userActions[funcName](contract, web3, getState, dispatch);
    }
    case 'setTab': {
      return userActions[funcName](dispatch, payload);
    }

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default userActionsHandler;
