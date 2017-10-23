const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'forms';
  chrome.runtime.sendMessage(action);
};

export const addFormMessage = (payload) => {
  pm({ action: 'addForm', payload });
};

export const updateFieldMetaMessage = (payload) => {
  pm({ action: 'updateFieldMeta', payload });
};

export const updateFieldErrorMessage = (payload) => {
  pm({ action: 'updateFieldError', payload });
};
