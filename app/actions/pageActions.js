import lightwallet from 'eth-lightwallet';
import { _checkUsernameVerified, sendTransaction } from '../modules/ethereumService';
import {
  SEND_TIP, SEND_TIP_ERROR, SEND_TIP_SUCCESS, CLEAR_TIP_PENDING,
  BUY_GOLD, BUY_GOLD_SUCCESS, BUY_GOLD_ERROR, CLEAR_GOLD_PENDING
} from '../constants/actionTypes';

const keyStore = lightwallet.keystore;

/**
 * Checks if a certain reddit username is verified and send message back to the tab
 * that requested the data
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Object} payload - { username, index, type }
 * @param {Number} tabId
 */
export const checkIfUsernameVerified = async (web3, contract, payload, tabId) => {
  const isVerified = await _checkUsernameVerified(web3, contract, web3.toHex(payload.username));

  const newPayload = payload;
  newPayload.isVerified = isVerified;

  chrome.tabs.sendMessage(tabId, { type: 'checkIfUsernameVerified', payload: newPayload });
};

/**
 * Dispatches action to clear tip form values after closing popup/changing views
 *
 * @param {Function} dispatch
 */
export const clearTipPending = (dispatch) => { dispatch({ type: CLEAR_TIP_PENDING }); };

/**
 * Dispatches action to clear buy gold form values after closing popup/changing views
 *
 * @param {Function} dispatch
 */
export const clearGoldPending = (dispatch) => { dispatch({ type: CLEAR_GOLD_PENDING }); };

/**
 * Handles tip form submit action
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const tip = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const amount = web3.toWei(state.forms.tipForm.amount.value);
  const gasPrice = web3.toWei(state.forms.tipForm.gasPrice.value, 'gwei');
  const author = state.modals.modalProps.author;
  const id = state.modals.modalProps.id;
  const ks = keyStore.deserialize(state.keyStore.keyStore);
  const address = state.keyStore.address;
  const password = state.keyStore.password;
  const contractMethod = contract.tipUser;

  const params = [
    web3.toHex(author), // bytes32 _username
    web3.toHex(id) // bytes32 _commentId
  ];

  try {
    dispatch({ type: SEND_TIP });

    await sendTransaction(web3, contractMethod, ks, address, password, params, amount, gasPrice);

    dispatch({ type: SEND_TIP_SUCCESS });
  } catch (err) {
    dispatch({ type: SEND_TIP_ERROR });
  }
};

/**
 * Handles buy gold form submit action
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const buyGold = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const gasPrice = web3.toWei(state.forms.buyGoldForm.gasPrice.value, 'gwei');
  const months = state.forms.buyGoldForm.months.value.toString();
  const author = state.modals.modalProps.author;
  const id = state.modals.modalProps.id;
  const ks = keyStore.deserialize(state.keyStore.keyStore);
  const address = state.keyStore.address;
  const password = state.keyStore.password;
  const contractMethod = contract.buyGold;

  dispatch({ type: BUY_GOLD });

  try {
    const res = await fetch(
      `https://reddapp.decenter.com/gold.php?months=${months}&toUsername=${author}&fromAddress=${address}&id=${id}`
    );
    const data = await res.json();

    const amount = web3.toWei(data.priceInEth.toString());

    const params = [
      web3.toHex(author), // bytes32 _to
      months, // string _months
      data.priceInUsd.toString(), // string _priceUsd
      web3.toHex(id), // bytes32 _commentId
      data.nonce.toString(), // string _nonce
      data.signature, // string _signature
    ];

    await sendTransaction(web3, contractMethod, ks, address, password, params, amount, gasPrice);

    dispatch({ type: BUY_GOLD_SUCCESS });
  } catch (err) {
    dispatch({ type: BUY_GOLD_ERROR });
  }
};
