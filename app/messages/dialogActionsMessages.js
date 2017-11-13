const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'dialog';
  chrome.runtime.sendMessage(action);
};

export const handleUserAuthenticationMessage = () => { pm({ action: 'handleUserAuthentication' }); };
