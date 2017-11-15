const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'account';
  chrome.runtime.sendMessage(action);
};

export const clearPasswordMessage = () => {
  pm({ action: 'clearPassword' });
};

export const sendMessage = () => {
  pm({ action: 'send' });
};

export const refundMessage = () => {
  pm({ action: 'refund' });
};

export const clearRefundValuesMessage = () => {
  pm({ action: 'clearRefundValues' });
};
