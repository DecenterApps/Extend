import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'dropdown';
  port.postMessage(action);
};

export const toggleDropdownMessage = (toggleDropdown) => {
  pm({ action: 'toggleDropdown', payload: toggleDropdown });
};
