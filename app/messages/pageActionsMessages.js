const HANDLER_NAME = 'page';

export const checkIfUsernameVerifiedMessage = (username, index, type) => {
  chrome.runtime.sendMessage('', {
    handler: HANDLER_NAME,
    action: 'checkIfUsernameVerified',
    payload: { username, index, type }
  });
};
