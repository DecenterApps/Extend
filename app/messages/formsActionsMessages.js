import { STORE_PORT } from '../constants/general';

const port = chrome.runtime.connect('', { name: STORE_PORT });

const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'forms';
  port.postMessage(action);
};

export const addFormMessage = (payload) => {
  pm({ action: 'addForm', payload });
};

export const updateFieldMetaMessage = (payload) => {
  pm({ action: 'updateFieldMeta', payload });
};
