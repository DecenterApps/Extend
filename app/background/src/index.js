import { createStore } from 'redux';
import rootReducer from './reducers/index';
import { wrapStore } from '../../modules/react-chrome-redux/index';
import { STORE_PORT, NETWORKS } from '../../constants/general';
import * as userActions from '../../actions/userActions';
import * as accountActions from '../../actions/accountActions';
import * as dropdownActions from '../../actions/dropdownActions';
import contractConfig from '../../modules/config.json';

const store = createStore(rootReducer, {});
const dispatch = store.dispatch;
const getState = store.getState;

wrapStore(store, { portName: STORE_PORT });

let web3 = new Web3(new Web3.providers.HttpProvider(getState().user.selectedNetwork.url));
let contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);

userActions.setAddress(contract, getState().user.address, dispatch, web3);
userActions.setNetwork(web3, dispatch);

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    const funcName = msg.action;
    const payload = msg.payload;

    switch (funcName) {
      case 'selectNetwork': {
        try {
          console.log('TRY');
          web3 = new Web3(new Web3.providers.HttpProvider(NETWORKS[payload].url));
          contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);
        } catch (err) {
          console.log('COULD NOT CONNECT TO NETWORK', err);
          return false;
        }

        userActions.setNetwork(web3, dispatch);

        return userActions[funcName](dispatch, payload);
      }

      case 'createUserAuth':
        return userActions[funcName](contract, web3, getState().user.address, dispatch);

      case 'createWallet':
        return accountActions[funcName]();

      case 'toggleDropdown':
        console.log('toggle dropdown', payload);
        return dropdownActions[funcName](dispatch, payload);

      default:
        console.log('action is not handled', funcName);
        return false;
    }
  });
});
