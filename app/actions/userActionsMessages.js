import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

export const createUserAuthMessage = () => {
  port.postMessage({ action: 'createUserAuth' });
};