import blockies from 'blockies';
import lightwallet from '../modules/eth-lightwallet/lightwallet';
import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK,
  SET_BALANCE, REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR
} from '../constants/actionTypes';
import { LOCK_INTERVAL } from '../constants/general';
import { isJson, formatLargeNumber, getParameterByName } from '../actions/utils';
import { _createUser } from '../modules/ethereumService';

let lockTimeout = null;
const keyStore = lightwallet.keystore;

/**
 * Sets the web3 default address if there is one
 *
 * @param {Object} web3
 * @param {Function} getState
 */
export const setDefaultAcc = (web3, getState) => {
  const address = getState().account.address;

  if (!address) return;

  web3.eth.defaultAccount = address; // eslint-disable-line
};

/**
 * Gets balance from web and dispatches action to set the balance
 *
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const setBalance = (web3, getState, dispatch) => {
  const address = getState().account.address;

  if (!address) return;

  const unformatedNum = parseFloat(web3.fromWei(web3.eth.getBalance(address)).toString());

  dispatch({ type: SET_BALANCE, payload: formatLargeNumber(unformatedNum) });
};

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
    const unformatedNum = parseFloat(web3.fromWei(web3.eth.getBalance(address)).toString());
    const balance = formatLargeNumber(unformatedNum);

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
 * Opens Reddit oauth window and receives user access_token. Access_token and
 * user address are sent to the contract
 *
 * @param {Object} contract
 * @param {String} address
 * @param {Function} dispatch
 * @param {Object} web3
 */
export const createUserAuth = (contract, web3, getState, dispatch) => {
  const redirectUri = chrome.identity.getRedirectURL('oauth2');
  const account = getState().account;
  const ks = keyStore.deserialize(account.keyStore);
  const address = account.address;
  const password = account.password;

  // dispatch({ type: REGISTER_USER });

  chrome.identity.launchWebAuthFlow({
    url: `https://www.reddit.com/api/v1/authorize?client_id=AFH0yVxKuLUlVQ&response_type=token&state=asdf&redirect_uri=${redirectUri}&scope=identity`,
    interactive: true
  }, async (authResponse) => {
    if (!authResponse) {
      console.log('EXITED AUTH PROCCESS');
      return;
    }

    const response = authResponse.replace(/#/g, '?');
    const accessToken = getParameterByName('access_token', response);

    const request = new Request('https://oauth.reddit.com/api/v1/me', {
      headers: new Headers({
        'Authorization': `bearer ${accessToken}`
      })
    });

    try {
      const redditMeResponse = await fetch(request);
      const me = await redditMeResponse.json();

      // if (me.error) return dispatch({ type: REGISTER_USER_ERROR });

      // dispatch({ type: REGISTER_USER_SUCCESS, payload: me.name });

      const contractResponse = await _createUser(contract, web3, me.name, accessToken, ks, address, password); // eslint-disable-line
      // dispatch({ type: REGISTER_USER_ERROR });
    } catch (err) {
      console.log('REGISTER_USER_ERROR', err);
      dispatch({ type: REGISTER_USER_ERROR });
    }
  });
};
