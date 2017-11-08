import * as formsActions from '../actions/formsActions';

const formsActionsHandler = (web3, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'addForm':
    case 'updateFieldMeta':
    case 'updateFieldError':
      return formsActions[funcName](dispatch, payload);

    case 'setRegisterFormTxPrice':
    case 'setSendFormTxPrice':
    case 'setRefundFormTxPrice':
    case 'setWithdrawFormTxPrice':
    case 'setTipFormTxPrice':
    case 'setBuyGoldFormTxPrice':
      return formsActions[funcName](web3, contracts.func, dispatch, getState);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default formsActionsHandler;
