import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

export const toggleDropdownMessage = (toggleDropdown) => {
  port.postMessage({ action: 'toggleDropdown', payload: toggleDropdown });
};
