import * as dropdownActions from '../actions/dropdownActions';

const dropdownActionsHandler = (web3, contract, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'toggleDropdown':
      return dropdownActions[funcName](dispatch, payload);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default dropdownActionsHandler;
