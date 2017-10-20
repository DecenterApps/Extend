import { STORE_PORT } from '../constants/general';
import { toggleDropdownMessage } from './dropdownActionMessages';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'user';
  port.postMessage(action);
};

export const createUserAuthMessage = () => { pm({ action: 'createUserAuth' }); };

export const acceptPrivacyNoticeMessage = () => { pm({ action: 'acceptPrivacyNotice' }); };

export const selectedNetworkMessage = (index) => {
  pm({ action: 'selectNetwork', payload: index });
  toggleDropdownMessage(true, false);
};