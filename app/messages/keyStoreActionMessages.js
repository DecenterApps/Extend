const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'keyStore';
  chrome.runtime.sendMessage(action);
};

export const createWalletMessage = (fields) => {
  pm({ action: 'createWallet', payload: { password: fields.password.value } });
};

export const importAccountMessage = (fields) => {
  pm({
    action: 'importAccount',
    payload: {
      password: fields.password.value,
      seed: fields.seed.value
    }
  });
};

export const checkIfPasswordValidMessage = (fields) => {
  pm({ action: 'checkIfPasswordValid', payload: fields.password.value });
};

export const clearPasswordMessage = () => { pm({ action: 'clearPassword' }); };
