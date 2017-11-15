import * as permanentActions from '../actions/permanentActions';

const permanentActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'copiedSeed':
    case 'acceptNotice':
      return permanentActions[funcName](dispatch);

    case 'changeView':
      return permanentActions[funcName](dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default permanentActionsHandler;