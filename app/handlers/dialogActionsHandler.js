import * as dialogActions from '../actions/dialogActions';

const dialogActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'handleUserAuthentication':
      return dialogActions[funcName](contracts, web3, getState, dispatch);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default dialogActionsHandler;
