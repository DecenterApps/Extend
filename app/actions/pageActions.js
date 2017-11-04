import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { _checkUsernameVerified, sendTransaction } from '../modules/ethereumService';
import { toggleModal } from './modalsActions';
import {
  SEND_TIP, SEND_TIP_ERROR, SEND_TIP_SUCCESS,
  BUY_GOLD, BUY_GOLD_SUCCESS, BUY_GOLD_ERROR
} from '../constants/actionTypes';

const keyStore = lightwallet.keystore;

export const checkIfUsernameVerified = async (web3, contract, payload, tabId) => {
  const isVerified = await _checkUsernameVerified(web3, contract, web3.toHex(payload.username));

  const newPayload = payload;
  newPayload.isVerified = isVerified;

  chrome.tabs.sendMessage(tabId, { type: 'checkIfUsernameVerified', payload: newPayload });
};

export const tip = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const amount = web3.toWei(state.forms.tipForm.amount.value);
  const gasPrice = web3.toWei(state.forms.tipForm.gasPrice.value, 'gwei');
  const author = state.modals.modalProps.author;
  const ks = keyStore.deserialize(state.account.keyStore);
  const address = state.account.address;
  const password = state.account.password;
  const contractMethod = contract.tipUser;

  try {
    dispatch({ type: SEND_TIP });

    await sendTransaction(web3, contractMethod, ks, address, password, [web3.toHex(author)], amount, gasPrice);

    dispatch({ type: SEND_TIP_SUCCESS });

    toggleModal(dispatch, { modalType: '', modalProps: {}, action: false });
  } catch (err) {
    dispatch({ type: SEND_TIP_ERROR });
  }
};

export const buyGold = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const gasPrice = web3.toWei(state.forms.buyGoldForm.gasPrice.value, 'gwei');
  const months = state.forms.buyGoldForm.months.value.toString();
  const author = state.modals.modalProps.author;
  const ks = keyStore.deserialize(state.account.keyStore);
  const address = state.account.address;
  const password = state.account.password;
  const contractMethod = contract.buyGold;

  dispatch({ type: BUY_GOLD });

  try {
    const res = await fetch(
      `https://reddapp.decenter.com/gold.php?months=${months}&toUsername=${author}&fromAddress=${address}`
    );
    const data = await res.json();

    const amount = web3.toWei(data.priceInEth.toString());

    const params = [
      web3.toHex(author), // bytes32 _to
      months, // string _months
      data.priceInUsd.toString(), // string _priceUsd
      data.nonce.toString(), // string _nonce
      data.signature, // string _signature
    ];

    await sendTransaction(web3, contractMethod, ks, address, password, params, amount, gasPrice);

    dispatch({ type: BUY_GOLD_SUCCESS });
    toggleModal(dispatch, { modalType: '', modalProps: {}, action: false });
  } catch (err) {
    dispatch({ type: BUY_GOLD_ERROR });
  }
};
