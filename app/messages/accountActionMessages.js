import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'account';
  port.postMessage(action);
};

export const createWalletMessage = () => { pm({ action: 'createWallet' }); };
