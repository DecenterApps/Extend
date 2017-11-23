import * as keyStoreActions from '../actions/keyStoreActions';

const keyStoreActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'clearPassword':
      return keyStoreActions[funcName](dispatch, getState);

    case 'createWallet':
      return keyStoreActions[funcName](web3, engine, dispatch, getState, payload);

    case 'importAccount':
      return keyStoreActions.createWallet(web3, engine, dispatch, getState, payload, true);

    case 'checkIfPasswordValid':
      return keyStoreActions[funcName](getState, dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default keyStoreActionsHandler;
