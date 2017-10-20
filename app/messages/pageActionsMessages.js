const HANDLER_NAME = 'page';

export const checkIfUsernameVerifiedMessage = (username, index) => {
  chrome.runtime.sendMessage('', {
    handler: HANDLER_NAME,
    action: 'checkIfUsernameVerified',
    payload: { username, index }
  });
};
