import * as userActions from '../actions/userActions';

const userActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createUserAuth': {
      return userActions[funcName](contract, web3, getState().user.address, dispatch);
    }

    case 'acceptPrivacyNotice': {
      return userActions[funcName](dispatch);
    }

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default userActionsHandler;
