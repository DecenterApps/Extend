import { STORE_PORT } from '../constants/general';
import { toggleDropdownMessage } from './dropdownActionMessages';

const port = chrome.runtime.connect('', { name: STORE_PORT });

export const createUserAuthMessage = () => {
  port.postMessage({ action: 'createUserAuth' });
};

export const selectedNetworkMessage = (index) => {
  port.postMessage({ action: 'selectNetwork', payload: index });
  toggleDropdownMessage(false);
};