const HANDLER_NAME = 'modals';

export const toggleModalMessage = (modalType, modalProps, action) => {
  chrome.runtime.sendMessage('', {
    handler: HANDLER_NAME,
    action: 'toggleModal',
    payload: { modalType, modalProps, action }
  });
};