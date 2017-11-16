import * as permanentActions from '../actions/permanentActions';

const permanentActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'acceptNotice':
      return permanentActions[funcName](dispatch);

    case 'copiedSeed':
      return permanentActions[funcName](dispatch, getState);

    case 'changeView':
      return permanentActions[funcName](dispatch, getState, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default permanentActionsHandler;