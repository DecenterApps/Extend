import * as formsActions from '../actions/formsActions';

const formsActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'addForm':
    case 'updateForm':
    case 'updateFieldMeta':
    case 'updateFieldError':
      return formsActions[funcName](dispatch, payload);

    case 'setRegisterFormTxPrice':
    case 'setOldUserFormTxPrice':
    case 'setSendFormTxPrice':
    case 'setRefundFormTxPrice':
    case 'setTipFormTxPrice':
    case 'setBuyGoldFormTxPrice':
      return formsActions[funcName](web3, contracts.func, dispatch, getState);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default formsActionsHandler;
