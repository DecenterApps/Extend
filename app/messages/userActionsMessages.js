import { toggleDropdownMessage } from './dropdownActionMessages';

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'user';
  chrome.runtime.sendMessage(action);
};


export const createUserAuthMessage = () => { pm({ action: 'createUserAuth' }); };

export const acceptPrivacyNoticeMessage = () => { pm({ action: 'acceptPrivacyNotice' }); };

export const selectedNetworkMessage = (index) => {
  pm({ action: 'selectNetwork', payload: index });
  toggleDropdownMessage(true, false);
};

export const setActiveTabMessage = (tabName) => {
  pm({ action: 'setTab', payload: tabName });
};
