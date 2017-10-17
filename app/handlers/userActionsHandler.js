import * as userActions from '../actions/userActions';

const userActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'acceptPrivacyNotice': {
      return userActions[funcName](dispatch);
    }

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default userActionsHandler;
