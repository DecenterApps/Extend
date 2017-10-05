import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

export const createWalletMessage = () => {
  port.postMessage({ action: 'createWallet' });
};