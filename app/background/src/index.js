import createStore from '../../customRedux/createStore';
import combinedReducers from './reducers/index';
import contractConfig from '../../modules/config.json';
import * as userActions from '../../actions/userActions';
import accountHandler from '../../handlers/accountActionsHandler';
import dropdownHandler from '../../handlers/dropdownActionsHandler';
import userHandler from '../../handlers/userActionsHandler';
import formsHandler from '../../handlers/formsActionsHandler';
import pageHandler from '../../handlers/pageActionsHandler';
import handleChangeNetwork from '../../modules/handleChangeNetwork';
import clearPendingStates from '../../modules/clearPendingStates';
import modalsActionsHandler from '../../handlers/modalsActionsHandler';

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
      await clearPendingStates(dispatch, combinedReducers);
      let networkData = await handleChangeNetwork(Web3, contractConfig, dispatch, getState);

      web3 = networkData.web3;
      contracts = networkData.contracts;
      engine = networkData.engine;

      resolve();
    } catch (err) {
      await userActions.networkUnavailable(dispatch);
      reject(err);
    }

    appLoaded = true;
  });

Promise.resolve(startApp()).then((err) => {
  if (err) return;

  setInterval(() => {
    web3.version.getNetwork(async (error) => {
      const disconnected = getState().user.disconnected;

      if (error && !disconnected) {
        await userActions.setDisconnected(dispatch, true);
        return;
      }

      if (!error && disconnected) {
        await userActions.setDisconnected(dispatch, false);
        await startApp();
      }
    });
  }, 2000);
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
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
    case 'account':
      return accountHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'dropdown':
      return dropdownHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'user':
      return userHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'forms':
      return formsHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    case 'page':
      return pageHandler(web3, engine, contracts, getState, dispatch, funcName, payload, sender.tab.id);
    case 'modals':
      return modalsActionsHandler(web3, engine, contracts, getState, dispatch, funcName, payload);
    default:
      throw Error('Action Handler not defined', handler);
  }
});
