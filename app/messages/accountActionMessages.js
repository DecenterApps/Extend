const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'account';
  chrome.runtime.sendMessage(action);
};

export const sendMessage = () => {
  pm({ action: 'send' });
};

export const refundMessage = () => {
  pm({ action: 'refund' });
};

export const clearRefundValuesMessage = () => { pm({ action: 'clearRefundValues' }); };
export const clearSendValuesMessage = () => { pm({ action: 'clearSendValues' }); };
