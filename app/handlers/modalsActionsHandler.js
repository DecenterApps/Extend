import * as modalsActions from '../actions/modalsActions';

const modalsActionsHandler = (web3, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'toggleModal':
      return modalsActions[funcName](dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default modalsActionsHandler;
