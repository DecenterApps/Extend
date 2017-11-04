const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'page';
  chrome.runtime.sendMessage(action);
};

export const checkIfUsernameVerifiedMessage = (username, index, type) => {
  pm({ action: 'checkIfUsernameVerified', payload: { username, index, type } });
};

export const tipMessage = () => { pm({ action: 'tip' }); };

export const buyGoldMessage = () => { pm({ action: 'buyGold' }); };
