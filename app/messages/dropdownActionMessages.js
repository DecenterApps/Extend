const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'dropdown';
  chrome.runtime.sendMessage(action);
};

export const toggleDropdownMessage = (currentState, toggleDropdown) => {
  if (currentState === false && toggleDropdown === false) return;
  pm({ action: 'toggleDropdown', payload: toggleDropdown });
};
