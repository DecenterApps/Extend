const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'keyStore';
  chrome.runtime.sendMessage(action);
};

export const createWalletMessage = (fields) => {
  pm({ action: 'createWallet', payload: fields.password.value });
};
