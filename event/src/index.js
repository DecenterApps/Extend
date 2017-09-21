import { createStore } from 'redux';
import rootReducer from './reducers';
import { wrapStore } from 'react-chrome-redux';
import { SET_ADDRESS, SET_NETWORK } from '../../actions/types';

const store = createStore(rootReducer, {});
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

wrapStore(store, {
  portName: 'example'
});

web3.version.getNetwork((err, netId) => {
  switch (netId) {
    case "1":
      store.dispatch({ type: SET_NETWORK, payload: 'mainnet' });
      break;
    case "2":
      store.dispatch({ type: SET_NETWORK, payload: 'morden' });
      break;
    case "3":
      store.dispatch({ type: SET_NETWORK, payload: 'ropsten' });
      break;
    case "4":
      store.dispatch({ type: SET_NETWORK, payload: 'rinkeby' });
      break;
    case "42":
      store.dispatch({ type: SET_NETWORK, payload: 'kovan' });
      break;
    default:
      store.dispatch({ type: SET_NETWORK, payload: 'unknown' });
  }
})

/**
 * Listens for posible user change of metaMask account/address
 *
 */
const pollForAddressChange = () => {
  setInterval(() => {

    if (!web3.eth.accounts[0]) {
      store.dispatch({ type: SET_ADDRESS, payload: '' });
      return;
    }

    if (web3.eth.accounts[0] === store.getState().user.address) return;

    store.dispatch({ type: SET_ADDRESS, payload: web3.eth.accounts[0] });

  }, 100);
};

pollForAddressChange();
