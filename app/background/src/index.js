import { createStore } from 'redux';
import rootReducer from './reducers/index';
import { wrapStore } from '../../modules/react-chrome-redux/index';
import { STORE_PORT } from '../../constants/general';
import { setNetwork, setAddress } from '../../actions/userActions';
import * as userActions from '../../actions/userActions';

const store = createStore(rootReducer, {});
const dispatch = store.dispatch;
const getState = store.getState;

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

wrapStore(store, { portName: STORE_PORT });
setAddress(getState().user.address, dispatch, web3);
setNetwork(web3, dispatch);

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener((msg) => {
    const funcName = msg.action;

    switch (funcName) {
      case 'createUserAuth':
        userActions[funcName](getState().user.address, dispatch);
        return;

      default:
        return msg.action;
    }
  });
});
