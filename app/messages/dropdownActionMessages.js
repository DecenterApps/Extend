import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'dropdown';
  port.postMessage(action);
};

export const toggleDropdownMessage = (currentState, toggleDropdown) => {
  if (currentState === false && toggleDropdown === false) return;
  pm({ action: 'toggleDropdown', payload: toggleDropdown });
};
