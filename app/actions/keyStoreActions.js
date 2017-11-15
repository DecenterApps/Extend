import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { formatLargeNumber } from '../actions/utils';
import { CREATE_WALLET, CLEAR_PASSWORD } from '../constants/actionTypes';
import {
  getBalanceForAddress
} from '../modules/ethereumService';
import { getPwDerivedKey, pollForBalance } from './accountActions';
import { changeView } from './userActions';
import { LOCK_INTERVAL } from '../constants/general';

let lockTimeout = null;

const keyStore = lightwallet.keystore;

/**
 * Clears password timeout and dispatches action to clear password
 *
 * @param {Function} dispatch
 */
export const clearPassword = (dispatch) => {
  clearTimeout(lockTimeout);
  dispatch({ type: CLEAR_PASSWORD });
  changeView(dispatch, { viewName: 'unlockAccount' });
};

/**
 *  Sets timeout to clear password after the user has created or unlocked the account
 */
export const passwordReloader = (dispatch) => {
  lockTimeout = setTimeout(() => {
    dispatch({ type: CLEAR_PASSWORD });
    changeView(dispatch, { viewName: 'unlockAccount' });
  }, LOCK_INTERVAL);
};

/**
 * Create a new key store with the users password
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {String} password
 */
export const createWallet = (web3, engine, dispatch, getState, password) => {
  keyStore.createVault({
    password,
  }, async (err, ks) => {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    const seed = ks.getSeed(pwDerivedKey);

    ks.generateNewAddress(pwDerivedKey, 1);

    const addresses = ks.getAddresses();
    const address = `0x${addresses[0]}`;
    const searializedKeyStore = ks.serialize();
    let balance = await getBalanceForAddress(web3, address);
    const unformatedNum = parseFloat(web3.fromWei(balance));
    balance = formatLargeNumber(unformatedNum);

    web3.eth.defaultAccount = address; // eslint-disable-line

    const payload = {
      seed, password, address, keyStore: searializedKeyStore, balance
    };

    await dispatch({ type: CREATE_WALLET, payload });

    changeView(dispatch, { viewName: 'copySeed' });
    pollForBalance(web3, engine, dispatch, getState);
  });
};
