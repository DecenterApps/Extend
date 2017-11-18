const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'permanent';
  chrome.runtime.sendMessage(action);
};

export const acceptNoticeMessage = () => { pm({ action: 'acceptNotice' }); };
export const copiedSeedMessage = () => { pm({ action: 'copiedSeed' }); };

export const changeViewMessage = (viewName, additionalChanges) => {
  pm({ action: 'changeView', payload: { viewName, additionalChanges } });
};
