import createStore from '../../customRedux/createStore';
import reducersData from './reducers/index';
import { NETWORKS } from '../../constants/general';
import contractConfig from '../../modules/config.json';
import * as userActions from '../../actions/userActions';
import accountHandler from '../../handlers/accountActionsHandler';
import dropdownHandler from '../../handlers/dropdownActionsHandler';
import userHandler from '../../handlers/userActionsHandler';
import formsHandler from '../../handlers/formsActionsHandler';

const startApp = async () => {
  const store = await createStore(reducersData);

  const dispatch = store.dispatch;
  const getState = store.getState;

  let web3 = new Web3(new Web3.providers.HttpProvider(getState().user.selectedNetwork.url));
  let contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);

  userActions.setNetwork(web3, dispatch);

  if (getState().account.password) {
    console.log('STARTED RELOAD');
    accountHandler(web3, contract, getState, dispatch, 'passwordReloader');
  }

  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (msg) => {
      const funcName = msg.action;
      const handler = msg.handler;
      const payload = msg.payload;

      // Only action that is handled here
      if (funcName === 'selectNetwork') {
        try {
          web3 = new Web3(new Web3.providers.HttpProvider(NETWORKS[payload].url));
          contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);

          userActions.setNetwork(web3, dispatch);
          return userActions[funcName](dispatch, payload);
        } catch (err) {
          throw Error('Cound not connect to the http provider', NETWORKS[payload].url, err);
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
};

startApp();
