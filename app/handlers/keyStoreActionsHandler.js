import * as keyStoreActions from '../actions/keyStoreActions';

const keyStoreActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'createWallet':
      return keyStoreActions[funcName](web3, engine, dispatch, getState, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default keyStoreActionsHandler;
