import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'account';
  port.postMessage(action);
};

export const createWalletMessage = (fields) => {
  pm({ action: 'createWallet', payload: fields.password.value });
};

export const copiedSeedMessage = () => {
  pm({ action: 'copiedSeed' });
};
