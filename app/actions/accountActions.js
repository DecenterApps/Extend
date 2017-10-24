import blockies from 'blockies';
import lightwallet from '../modules/eth-lightwallet/lightwallet';
import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS
} from '../constants/actionTypes';
import { LOCK_INTERVAL } from '../constants/general';
import { isJson, formatLargeNumber } from '../actions/utils';
import {
  _checkAddressVerified, getBalanceForAddress, getGasPrice, transfer, pollForReceipt, getNonceForAddress
} from '../modules/ethereumService';

let lockTimeout = null;
const keyStore = lightwallet.keystore;

// TODO test this poller
export const pollPendingTxs = (web3, dispatch, getState) => {
  const transactions = getState().account.transactions;

  transactions.forEach((transaction) => {
    if (!transaction.status === 'pending') return;

    pollForReceipt(web3, dispatch, getState, transaction.hash);
  });
};

export const send = async (web3, getState, dispatch) => {
  const state = getState();
  const formData = state.forms.sendForm;
  const to = formData.to.value;
  const amount = web3.toWei(parseFloat(formData.amount.value));
  const gasPrice = web3.toWei(formData.gasPrice.value, 'gwei');
  const address = state.account.address;
  const ks = keyStore.deserialize(state.account.keyStore);
  const password = state.account.password;
  const nonce = await getNonceForAddress(web3, address);

  dispatch({ type: SEND });

  try {
    const txHash = await transfer(web3, address, to, amount, gasPrice, ks, password, nonce);
    dispatch({
      type: SEND_SUCCESS,
      payload: {
        state: 'pending',
        time: new Date(), // format time here
        hash: txHash,
        from: address,
        nonce,
        to
      }
    });

    pollForReceipt(web3, dispatch, getState, txHash);
  } catch(err) {
    dispatch({ type: SEND_ERROR });
  }
};

/**
 * Dispatches action to set the gas price to the value from web3
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Number} currentGasPriceParam
 */
export const setBalance = (web3, dispatch, currentGasPriceParam) =>
  new Promise(async (resolve) => {
    let currentGasPrice = currentGasPriceParam;

    let newGasPrice = await getGasPrice(web3);
    newGasPrice = parseFloat(web3.fromWei(newGasPrice.toString(), 'gwei'));

    if (currentGasPrice === newGasPrice) return;

    currentGasPrice = newGasPrice;
    dispatch({ type: SET_GAS_PRICE, payload: newGasPrice });
    resolve(currentGasPrice);
  });

/**
 * Checks the median gas price by using web3 every minute and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 */
export const pollForGasPrice = async (web3, dispatch) => {
  let currentGasPrice = 0;
  currentGasPrice = await setBalance(web3, dispatch, currentGasPrice);

  setInterval(async () => {
    currentGasPrice = await setBalance(web3, dispatch, currentGasPrice);
  }, 1000);
};

/**
 * Checks the balance by using web3 every second and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {String} address
 */
export const pollForBalance = (web3, dispatch, address) => {
  let currentBalance = '';
  setInterval(async () => {
    const newBalance = await getBalanceForAddress(web3, address);

    if (currentBalance === newBalance) return;

    currentBalance = newBalance;
    dispatch({ type: SET_BALANCE, payload: web3.fromWei(newBalance) });
  }, 1000);
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

    await dispatch({ type: CREATE_WALLET, payload });
    pollForBalance(web3, dispatch, address);
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
