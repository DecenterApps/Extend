import createStore from '../../customRedux/createStore';
import combinedReducers from './reducers/index';
import contractConfig from '../../modules/config.json';
import * as userActions from '../../actions/userActions';
import * as permanentActions from '../../actions/permanentActions';
import * as accountActions from '../../actions/accountActions';
import accountHandler from '../../handlers/accountActionsHandler';
import permanentHandler from '../../handlers/permanentActionsHandler';
import keyStoreHandler from '../../handlers/keyStoreActionsHandler';
import dropdownHandler from '../../handlers/dropdownActionsHandler';
import userHandler from '../../handlers/userActionsHandler';
import formsHandler from '../../handlers/formsActionsHandler';
import pageHandler from '../../handlers/pageActionsHandler';
import modalsHandler from '../../handlers/modalsActionsHandler';
import dialogHandler from '../../handlers/dialogActionsHandler';
import onboardingHandler from '../../handlers/onboardingActionsHandler';
import handleChangeNetwork from '../../modules/handleChangeNetwork';

let appLoaded = null;

let store = null;
let dispatch = null;
let getState = null;
let web3 = null;
let contracts = null;
let engine = null;

const startApp = () =>
  new Promise(async (resolve, reject) => {
    store = await createStore(combinedReducers);
    dispatch = store.dispatch;
    getState = store.getState;

    try {
      let networkData = await handleChangeNetwork(Web3, contractConfig, dispatch, getState);

      web3 = networkData.web3;
      contracts = networkData.contracts;
      engine = networkData.engine;

      resolve();
    } catch (err) {
      await userActions.networkUnavailable(dispatch, getState);
      reject(err);
    }

    appLoaded = true;
  });

Promise.resolve(startApp()).then((err) => {
  if (err) return;

  setInterval(() => {
    web3.version.getNetwork(async (error) => {
      const disconnected = getState().permanent.disconnected;

      if (error && !disconnected) {
        await permanentActions.setDisconnected(dispatch, true);
        return;
      }

      if (!error && disconnected) {
        await permanentActions.setDisconnected(dispatch, false);
        await startApp();
      }
    });
  }, 2000);
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  // TODO add type to msg
  if (!msg.handler) return false;
  if (!appLoaded || getState().user.disconnected) return false;

  const funcName = msg.action;
  const handler = msg.handler;
  const payload = msg.payload;

  if (handler === 'user' && funcName === 'connectAgain') {
    userActions.connectAgain(dispatch);

    try {
      await startApp();
      userActions.connectingAgainSuccess(dispatch);
    } catch(err) {
      userActions.connectingAgainError(dispatch);
    }

    return false;
  }

  switch (handler) {
    case 'permanent':
      return permanentHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'keyStore':
      return keyStoreHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'account':
      return accountHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'dropdown':
      return dropdownHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'user':
      return userHandler(web3, engine, contracts, getState, dispatch, funcName, payload, sender);
    case 'forms':
      return formsHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'page':
      return pageHandler(web3, engine, contracts, getState, dispatch, funcName, payload, sender.tab.id);
    case 'modals':
      return modalsHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'dialog':
      return dialogHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'onboarding':
      return onboardingHandler(web3, engine, contracts, getState, dispatch, funcName, payload);

    default:
      throw Error('Action Handler not defined', handler);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (!getState().user.tabsIds.includes(tabId)) return;

  userActions.removeTabId(dispatch, tabId);
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId !== getState().user.dialogWindowId) return;

  userActions.clearRegisteringError(dispatch);
});

chrome.runtime.onConnect.addListener((_port) => {
  if (_port.name !== 'popup') return;

  let port = _port;

  // dispatch actions when the user closes the popup
  port.onDisconnect.addListener(() => {
    const state = getState();

    permanentActions.checkIfSeenDashboard(dispatch, getState);
    if (state.permanent.view === 'refund') accountActions.clearRefundValues(dispatch);
    if (state.permanent.view === 'send') accountActions.clearSendValues(dispatch);

    port = null;
  });
});
