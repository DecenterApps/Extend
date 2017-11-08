import lightwallet from '../modules/eth-lightwallet/lightwallet';
import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, WITHDRAW, WITHDRAW_ERROR, WITHDRAW_SUCCESS, SET_TIPS_BALANCE,
  REFUND, REFUND_ERROR, REFUND_SUCCESS, CLEAR_REFUND_VALUES
} from '../constants/actionTypes';
import { LOCK_INTERVAL } from '../constants/general';
import { isJson, formatLargeNumber } from '../actions/utils';
import {
  getBalanceForAddress, getGasPrice, transfer, pollForReceipt, getNonceForAddress, sendTransaction,
  _getTipBalance, _checkIfRefundAvailable, listenForRefundSuccessful
} from '../modules/ethereumService';
import AbstractPoller from '../modules/AbstractPoller';
import { changeView } from './userActions';

let lockTimeout = null;
const keyStore = lightwallet.keystore;

export const withdraw = async (web3, getState, dispatch, contracts) => {
  const state = getState();
  const formData = state.forms.withdrawForm;
  const gasPrice = web3.toWei(formData.gasPrice.value, 'gwei');
  const address = state.account.address;
  const ks = keyStore.deserialize(state.account.keyStore);
  const password = state.account.password;

  dispatch({ type: WITHDRAW });

  try {
    await sendTransaction(web3, contracts.func.withdraw, ks, address, password, null, 0, gasPrice);
    await dispatch({ type: WITHDRAW_SUCCESS });
    changeView(dispatch, { viewName: 'dashboard' });
  } catch(err) {
    dispatch({ type: WITHDRAW_ERROR });
  }
};

export const pollPendingTxs = (web3, dispatch, getState) => {
  const transactions = getState().account.transactions;

  transactions.forEach((transaction) => {
    if (transaction.status !== 'pending') return;

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

export const setTipsBalance = async (web3, contract, dispatch, getState) => {
  const currentTipBalance = getState().account.tipsBalance;

  const contractTipBalance = await _getTipBalance(web3, contract);

  if (currentTipBalance === contractTipBalance) return;

  dispatch({ type: SET_TIPS_BALANCE, payload: contractTipBalance });
};

/**
 * Dispatches action to set the gas price to the value from web3
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const setGasPrice = async (web3, dispatch, getState) => {
  let currentGasPrice = getState().account.gasPrice;

  let newGasPrice = await getGasPrice(web3);
  newGasPrice = parseFloat(web3.fromWei(newGasPrice.toString(), 'gwei'));

  if (currentGasPrice === newGasPrice) return;

  dispatch({ type: SET_GAS_PRICE, payload: newGasPrice });
};

/**
 * Checks the median gas price by using web3 every minute and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForGasPrice = async (web3, dispatch, getState) => {
  const poller = new AbstractPoller(setGasPrice, 1000, web3, dispatch, getState);
  poller.poll();
};

const setBalance = async (web3, dispatch, getState) => {
  const account = getState().account;
  let currentBalance = account.balance;
  let address = account.address;

  let newBalance = await getBalanceForAddress(web3, address);
  newBalance = web3.fromWei(newBalance);

  if (currentBalance === newBalance) return;

  await dispatch({ type: SET_BALANCE, payload: newBalance });
};

/**
 * Checks the balance by using web3 every second and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForBalance = (web3, dispatch, getState) => {
  const poller = new AbstractPoller(setBalance, 1000, web3, dispatch, getState);
  poller.poll();
};

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

    await dispatch({ type: UNLOCK, payload: password });
    changeView(dispatch, { viewName: 'dashboard' });
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
 * @param {Function} getState
 * @param {String} password
 */
export const createWallet = (web3, dispatch, getState, password) => {
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
    pollForBalance(web3, dispatch, getState);
  });
};

/**
 * Dispatches action that the user has copied the seed
 *
 * @param {Function} dispatch
 */
export const copiedSeed = (dispatch) => {
  dispatch({ type: COPIED_SEED });
  changeView(dispatch, { viewName: 'dashboard' });
  passwordReloader(dispatch);
};

export const clearRefundValues = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CLEAR_REFUND_VALUES });
    resolve();
  });

export const refund = async (web3, getState, dispatch, contracts) => {
  const state = getState();
  const formData = state.forms.refundForm;
  const gasPrice = web3.toWei(formData.gasPrice.value, 'gwei');
  const username = web3.toHex(formData.username.value);
  const address = state.account.address;
  const ks = keyStore.deserialize(state.account.keyStore);
  const password = state.account.password;

  const cb = async (err, event, eventInstance) => {
    if (web3.toUtf8(event.args.username) !== formData.username.value) return;

    eventInstance.stopWatching(() => {});

    await dispatch({ type: REFUND_SUCCESS });
    await clearRefundValues(dispatch);

    changeView(dispatch, { viewName: 'dashboard' });
  };

  dispatch({ type: REFUND });

  try {
    const hash = await sendTransaction(web3, contracts.func.refundMoneyForUser, ks, address, password, [username], 0, gasPrice); // eslint-disable-line
    console.log('LISTENING FOR REFUNCD', hash);
    listenForRefundSuccessful(web3, contracts.events, username, cb);
  } catch(err) {
    dispatch({ type: REFUND_ERROR });
  }
};
