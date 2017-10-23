import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { _checkUsernameVerified, sendTransaction } from '../modules/ethereumService';
import { toggleModal } from './modalsActions';
import { SEND_TIP, SEND_TIP_ERROR, SEND_TIP_SUCCESS } from '../constants/actionTypes'

const keyStore = lightwallet.keystore;

export const checkIfUsernameVerified = async (web3, contract, payload, tabId) => {
  const isVerified = await _checkUsernameVerified(web3, contract, payload.username);

  const newPayload = payload;
  newPayload.isVerified = isVerified;

  chrome.tabs.sendMessage(tabId, { type: 'checkIfUsernameVerified', payload: newPayload });
};

export const tip = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const amount = web3.toWei(state.forms.tipForm.amount.value);
  const gasPrice = state.forms.tipForm.gasPrice.value;
  const author = state.modals.modalProps.author;
  const ks = keyStore.deserialize(state.account.keyStore);
  const address = state.account.address;
  const password = state.account.password;
  const contractMethod = contract.tipUser;

  try {
    dispatch({ type: SEND_TIP });

    await sendTransaction(web3, contractMethod, ks, address, password, [author], amount, gasPrice);

    dispatch({ type: SEND_TIP_SUCCESS });

    toggleModal(dispatch, { modalType: '', modalProps: {}, action: false });
  } catch (err) {
    dispatch({ type: SEND_TIP_ERROR });
  }
};
