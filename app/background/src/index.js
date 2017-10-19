import createStore from '../../customRedux/createStore';
import reducersData from './reducers/index';
import contractConfig from '../../modules/config.json';
import * as userActions from '../../actions/userActions';
import accountHandler from '../../handlers/accountActionsHandler';
import dropdownHandler from '../../handlers/dropdownActionsHandler';
import userHandler from '../../handlers/userActionsHandler';
import formsHandler from '../../handlers/formsActionsHandler';
import handleChangeNetwork from '../../modules/handleChangeNetwork';

let appLoaded = null;

let store = null;
let dispatch = null;
let getState = null;
let web3 = null;
let contract = null;

const startApp = async () => {
  store = await createStore(reducersData);
  dispatch = store.dispatch;
  getState = store.getState;

  try {
    let networkData = await handleChangeNetwork(Web3, contractConfig, dispatch, getState);
    web3 = networkData.web3;
    contract = networkData.contract;
  } catch (err) {
    console.error('COULD NOT CONNECT TO NETWORK');
    userActions.networkUnavailable(dispatch);
  }

  appLoaded = true;
};

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
        return false;
      } catch (err) {
        userActions.networkUnavailable(dispatch);
        console.error('COULD NOT CONNECT TO NETWORK');
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

startApp();
