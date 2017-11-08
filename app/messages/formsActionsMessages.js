const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'forms';
  chrome.runtime.sendMessage(action);
};

export const addFormMessage = (payload) => {
  pm({ action: 'addForm', payload });
};

export const updateFieldMetaMessage = (payload) => {
  pm({ action: 'updateFieldMeta', payload });
};

export const updateFieldErrorMessage = (payload) => {
  pm({ action: 'updateFieldError', payload });
};

export const setRegisterFormTxPriceMessage = () => { pm({ action: 'setRegisterFormTxPrice' }); };
export const setSendFormTxPriceMessage = () => { pm({ action: 'setSendFormTxPrice' }); };
export const setRefundFormTxPriceMessage = () => { pm({ action: 'setRefundFormTxPrice' }); };
export const setWithdrawFormTxPriceMessage = () => { pm({ action: 'setWithdrawFormTxPrice' }); };
export const setTipFormTxPriceMessage = () => { pm({ action: 'setTipFormTxPrice' }); };
export const setBuyGoldFormTxPriceMessage = () => { pm({ action: 'setBuyGoldFormTxPrice' }); };
