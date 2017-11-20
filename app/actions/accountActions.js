import lightwallet from 'eth-lightwallet';
import {
  SET_BALANCE, SET_GAS_PRICE, SEND, SEND_ERROR, SEND_SUCCESS, REFUND, REFUND_ERROR,
  REFUND_SUCCESS, CLEAR_REFUND_VALUES, CLEAR_SEND_VALUES, SET_REFUND_FORM_VALUES
} from '../constants/actionTypes';
import {
  getBalanceForAddress, getGasPrice, transfer, getNonceForAddress, sendTransaction
} from '../modules/ethereumService';
import AbstractPoller from '../modules/AbstractPoller';

const keyStore = lightwallet.keystore;

/**
 * Handles transfer form submit action
 *
 * @param {Object} web3
 * @param {Object} engine
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const send = async (web3, engine, getState, dispatch) => {
  const state = getState();
  const formData = state.forms.sendForm;
  const to = formData.to.value;
  const amount = web3.toWei(parseFloat(formData.amount.value));
  const gasPrice = web3.toWei(formData.gasPrice.value, 'gwei');
  const address = state.keyStore.address;
  const ks = keyStore.deserialize(state.keyStore.keyStore);
  const password = state.keyStore.password;
  const nonce = await getNonceForAddress(web3, address);

  dispatch({ type: SEND });

  try {
    await transfer(web3, address, to, amount, gasPrice, ks, password, nonce);
    dispatch({ type: SEND_SUCCESS });
  } catch(err) {
    dispatch({ type: SEND_ERROR });
  }
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

  await dispatch({ type: SET_GAS_PRICE, payload: newGasPrice });
};

/**
 * Checks the median gas price by using web3 every block and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Object} engine
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForGasPrice = async (web3, engine, dispatch, getState) => {
  const poller = new AbstractPoller(setGasPrice, engine, web3, dispatch, getState);
  poller.poll();
};

/**
 * Dispatches action to set the balance to the value from web3
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
const setBalance = async (web3, dispatch, getState) => {
  const state = getState();
  let currentBalance = state.account.balance;
  let address = state.keyStore.address;

  let newBalance = await getBalanceForAddress(web3, address);
  newBalance = web3.fromWei(newBalance);

  if (currentBalance === newBalance) return;

  await dispatch({ type: SET_BALANCE, payload: newBalance });
};

/**
 * Checks the balance by using web3 every block and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Object} engine
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForBalance = (web3, engine, dispatch, getState) => {
  const poller = new AbstractPoller(setBalance, engine, web3, dispatch, getState);
  poller.poll();
};

/**
 * Dispatches action to clear refund form values after closing popup/changing views
 *
 * @param {Function} dispatch
 * @return {Promise}
 */
export const clearRefundValues = (dispatch) =>
  new Promise(async (resolve) => {
    dispatch({ type: CLEAR_REFUND_VALUES });
    resolve();
  });

/**
 * Dispatches action to clear send form values after closing popup/changing views
 *
 * @param {Function} dispatch
 * @return {Promise}
 */
export const clearSendValues = (dispatch) =>
  new Promise(async (resolve) => {
    dispatch({ type: CLEAR_SEND_VALUES });
    resolve();
  });

/**
 * Handles refund form submit action
 *
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 * @param {Object} contracts
 */
export const refund = async (web3, getState, dispatch, contracts) => {
  const state = getState();
  const formData = state.forms.refundForm;
  const gasPrice = web3.toWei(formData.gasPrice.value, 'gwei');
  const username = web3.toHex(state.account.refundTipUsername);
  const address = state.keyStore.address;
  const ks = keyStore.deserialize(state.keyStore.keyStore);
  const password = state.keyStore.password;
  const contractMethod = contracts.func.refundMoneyForUser;

  dispatch({ type: REFUND });

  try {
    await sendTransaction(web3, contractMethod, ks, address, password, [username], 0, gasPrice);

    dispatch({ type: REFUND_SUCCESS });
  } catch(err) {
    dispatch({ type: REFUND_ERROR });
  }
};

/**
 * Dispatches action to set values needed for refund form to function
 *
 * @param {Function} dispatch
 * @param {String} payload - username of the user that the refund is taken from
 */
export const setRefundFormValues = (dispatch, payload) => { dispatch({ type: SET_REFUND_FORM_VALUES, payload }); };
