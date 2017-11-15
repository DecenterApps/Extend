import lightwallet from '../modules/eth-lightwallet/lightwallet';
import {
  SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, REFUND, REFUND_ERROR, REFUND_SUCCESS, CLEAR_REFUND_VALUES
} from '../constants/actionTypes';
import {
  getBalanceForAddress, getGasPrice, transfer, pollForReceipt, getNonceForAddress, sendTransaction,
  listenForRefundSuccessful
} from '../modules/ethereumService';
import AbstractPoller from '../modules/AbstractPoller';

const keyStore = lightwallet.keystore;

export const pollPendingTxs = (web3, engine, dispatch, getState) => {
  const transactions = getState().account.transactions;

  transactions.forEach((transaction) => {
    if (transaction.status !== 'pending') return;

    pollForReceipt(web3, engine, dispatch, getState, transaction.hash);
  });
};

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
    const txHash = await transfer(web3, address, to, amount, gasPrice, ks, password, nonce);
    dispatch({
      type: SEND_SUCCESS,
      payload: {
        state: 'pending',
        hash: txHash,
        from: address,
        to,
        amount: formData.amount.value
      }
    });

    pollForReceipt(web3, engine, dispatch, getState, txHash);
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
 * Checks the median gas price by using web3 every minute and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForGasPrice = async (web3, engine, dispatch, getState) => {
  const poller = new AbstractPoller(setGasPrice, engine, web3, dispatch, getState);
  poller.poll();
};

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
 * Checks the balance by using web3 every second and sets it if the value has changed
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const pollForBalance = (web3, engine, dispatch, getState) => {
  const poller = new AbstractPoller(setBalance, engine, web3, dispatch, getState);
  poller.poll();
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
  const username = web3.toHex(state.user.refundTipUsername);
  const address = state.keyStore.address;
  const ks = keyStore.deserialize(state.keyStore.keyStore);
  const password = state.keyStore.password;

  const cb = async (err, event, eventInstance) => {
    if (web3.toUtf8(event.args.username) !== formData.username.value) return;

    eventInstance.stopWatching(() => {});

    dispatch({ type: REFUND_SUCCESS });
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
