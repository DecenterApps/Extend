const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'user';
  chrome.runtime.sendMessage(action);
};

export const createUserAuthMessage = () => { pm({ action: 'createUserAuth' }); };

export const setActiveTabMessage = (tabSlug) => {
  pm({ action: 'setTab', payload: tabSlug });
};

export const changeViewMessage = (viewName, additionalChanges) => {
  pm({ action: 'changeView', payload: { viewName, additionalChanges } });
};

export const connectAgainMessage = () => { pm({ action: 'connectAgain' }); };
