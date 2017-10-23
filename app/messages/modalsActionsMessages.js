const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'modals';
  chrome.runtime.sendMessage(action);
};

export const toggleModalMessage = (modalType, modalProps, action) => {
  pm({ action: 'toggleModal', payload: { modalType, modalProps, action } });
};