import blockies from 'blockies';
import lightwallet from '../modules/eth-lightwallet/lightwallet';
import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, SET_BALANCE
} from '../constants/actionTypes';
import { LOCK_INTERVAL } from '../constants/general';
import { isJson, formatLargeNumber } from '../actions/utils';
import { _checkAddressVerified, getBalanceForAddress } from '../modules/ethereumService';

let lockTimeout = null;
const keyStore = lightwallet.keystore;

/**
 * Gets balance from web and dispatches action to set the balance
 *
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const setBalance = (web3, getState, dispatch) =>
  new Promise(async (resolve) => {
    const address = getState().account.address;

    if (!address) return;

    const balance = await getBalanceForAddress(web3, address);
    const unformatedNum = parseFloat(web3.fromWei(balance));

    await dispatch({ type: SET_BALANCE, payload: formatLargeNumber(unformatedNum)});
    resolve();
  });

/**
 * Clears password timeout and dispatches action to clear password
 *
 * @param {Function} dispatch
 */
export const clearPassword = (dispatch) => {
  clearTimeout(lockTimeout);
  dispatch({ type: CLEAR_PASSWORD });
};

/**
 *  Sets timeout to clear password after the user has created or unlocked the account
 */
export const passwordReloader = (dispatch) => {
  lockTimeout = setTimeout(() => {
    dispatch({ type: CLEAR_PASSWORD });
  }, LOCK_INTERVAL);
};

/**
 * Returns a pw derived key from key store and password
 *
 * @param {Object} ks
 * @param {String} password
 * @return {Promise} pwDerivedKey
 */
export const getPwDerivedKey = (ks, password) =>
  new Promise((resolve, reject) => {
    ks.keyFromPassword(password, (err, pwDerivedKey) => {
      if (err) reject(err);
      resolve(pwDerivedKey);
    });
  });

/**
 * Returns a private key for a given address
 *
 * @param {JSON} keyStoreParam
 * @param {String} address
 * @param {Uint8Array} pwDerivedKey
 *
 * @return {String}
 */
export const getPrivateKey = (keyStoreParam, address, pwDerivedKey) => {
  let ks = keyStoreParam;

  if (isJson()) ks = keyStore.deserialize(ks);

  return ks.exportPrivateKey(address, pwDerivedKey);
};

/**
 *  Checks if the unlock account password matches the key store
 */
export const checkIfPasswordValid = async (getState, dispatch, password) => {
  const ks = keyStore.deserialize(getState().account.keyStore);

  try {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    getPrivateKey(ks, getState().account.address, pwDerivedKey);

    dispatch({ type: UNLOCK, payload: password });
    passwordReloader(dispatch);
  } catch(err) {
    dispatch({ type: UNLOCK_ERROR });
  }
};

/**
 * Create a new key store with the users password
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {String} password
 */
export const createWallet = (web3, dispatch, password) => {
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

    const accountIcon = blockies({
      seed: address,
      size: 8,
      scale: 8
    }).toDataURL();

    web3.eth.defaultAccount = address; // eslint-disable-line

    const payload = {
      seed, password, address, keyStore: searializedKeyStore, accountIcon, balance
    };

    dispatch({ type: CREATE_WALLET, payload });
  });
};

/**
 * Dispatches action that the user has copied the seed
 *
 * @param {Function} dispatch
 */
export const copiedSeed = (dispatch) => {
  dispatch({ type: COPIED_SEED });
  passwordReloader(dispatch);
};

/**
 *
 * @param web3
 * @param contract
 * @param getState
 * @return {Promise.<void>}
 */
export const checkAddressVerified = (web3, contract, getState) =>
  new Promise(async (resolve, reject) => {
    const address = getState().account.address;

    if (!address) resolve(false);

    try {
      const isVerified = await _checkAddressVerified(web3, contract, address);

      resolve(isVerified);
      // dispatch something
    } catch (err) {
      // dispatch something
      reject(err);
    }
  });
