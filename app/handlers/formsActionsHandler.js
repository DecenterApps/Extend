import * as formsActions from '../actions/formsActions';

const formsActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'addForm':
    case 'updateFieldMeta':
      return formsActions[funcName](dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default formsActionsHandler;
