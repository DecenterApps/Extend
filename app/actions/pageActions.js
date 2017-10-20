import { _checkUsernameVerified } from '../modules/ethereumService';

export const checkIfUsernameVerified = async (web3, contract, payload, tabId) => {
  const isVerified = await _checkUsernameVerified(web3, contract, payload.username);

  const newPayload = payload;
  newPayload.isVerified = isVerified;

  chrome.tabs.sendMessage(tabId, { type: 'checkIfUsernameVerified', payload: newPayload });
};
