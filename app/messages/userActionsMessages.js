const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'user';
  chrome.runtime.sendMessage(action);
};

export const openAuthWindowMessage = () => {
  pm({ action: 'openAuthWindow', payload: { screenWidth: screen.width, screenHeight: screen.height } });
};

export const setActiveTabMessage = (tabSlug) => {
  pm({ action: 'setTab', payload: tabSlug });
};

export const checkRefundForSentTipsMessage = () => { pm({ action: 'checkRefundForSentTips' }); };

export const connectAgainMessage = () => { pm({ action: 'connectAgain' }); };

export const addTabIdMessage = () => { pm({ action: 'addTabId' }); };
