import { createStore } from 'redux';
import rootReducer from './reducers/index';
import { wrapStore } from '../../modules/react-chrome-redux/index';
import { STORE_PORT } from '../../constants/general';
import { setNetwork, setAddress } from '../../actions/userActions';

const store = createStore(rootReducer, {});

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

wrapStore(store, { portName: STORE_PORT });
setAddress(store.getState().user.address, store.dispatch, web3);
setNetwork(web3, store.dispatch);
