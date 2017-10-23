import createStore from '../../customRedux/createStore';
import combinedReducers from './reducers/index';
import contractConfig from '../../modules/config.json';
import * as userActions from '../../actions/userActions';
import accountHandler from '../../handlers/accountActionsHandler';
import dropdownHandler from '../../handlers/dropdownActionsHandler';
import userHandler from '../../handlers/userActionsHandler';
import formsHandler from '../../handlers/formsActionsHandler';
import pageHandler from '../../handlers/pageHandler';
import handleChangeNetwork from '../../modules/handleChangeNetwork';
import modalsActionsHandler from '../../handlers/modalsActionsHandler';

let appLoaded = null;

let store = null;
let dispatch = null;
let getState = null;
let web3 = null;
let contract = null;

const startApp = async () => {
  store = await createStore(combinedReducers);
  dispatch = store.dispatch;
  getState = store.getState;

  try {
    let networkData = await handleChangeNetwork(Web3, contractConfig, dispatch, getState);
    web3 = networkData.web3;
    contract = networkData.contract;
  } catch (err) {
    userActions.networkUnavailable(dispatch);
  }

  appLoaded = true;
};

startApp();

/* Handles action calls from content script */
chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab.id;

  const funcName = message.action;
  const handler = message.handler;
  const payload = message.payload;

  switch (handler) {
    case 'page':
      return pageHandler(web3, contract, getState, dispatch, funcName, payload, tabId);
    case 'modals':
      return modalsActionsHandler(web3, contract, getState, dispatch, funcName, payload);
    default:
      throw Error('Action Handler not defined', handler);
  }
});

/* Handles port messages that change the state of the app */
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    if (!appLoaded) return false;

    const funcName = msg.action;
    const handler = msg.handler;
    const payload = msg.payload;

    if (funcName === 'selectNetwork') {
      try {
        await userActions.selectNetwork(dispatch, payload);

        let networkData = await handleChangeNetwork(Web3, contractConfig, dispatch, getState);

        web3 = networkData.web3;
        contract = networkData.contract;

        return networkData;
      } catch (err) {
        return userActions.networkUnavailable(dispatch);
      }
    }

    switch (handler) {
      case 'account':
        return accountHandler(web3, contract, getState, dispatch, funcName, payload);
      case 'dropdown':
        return dropdownHandler(web3, contract, getState, dispatch, funcName, payload);
      case 'user':
        return userHandler(web3, contract, getState, dispatch, funcName, payload);
      case 'forms':
        return formsHandler(web3, contract, getState, dispatch, funcName, payload);
      default:
        throw Error('Action Handler not defined', handler);
    }
  });
});
