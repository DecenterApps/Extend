const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'account';
  chrome.runtime.sendMessage(action);
};

export const createWalletMessage = (fields) => {
  pm({ action: 'createWallet', payload: fields.password.value });
};

export const copiedSeedMessage = () => {
  pm({ action: 'copiedSeed' });
};

export const checkIfPasswordValidMessage = (fields) => {
  pm({ action: 'checkIfPasswordValid', payload: fields.password.value });
};

export const clearPasswordMessage = () => {
  pm({ action: 'clearPassword' });
};

export const sendMessage = () => {
  pm({ action: 'send' });
};

export const withdrawMessage = () => {
  pm({ action: 'withdraw' });
};

export const refundMessage = () => {
  pm({ action: 'refund' });
};
