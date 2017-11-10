import {
  ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR, SET_TX_VAL, SET_TX_COST, REFUND_UNAVAILABLE, REFUND_AVAILABLE
} from '../constants/actionTypes';
import { getValOfEthInUsd } from '../actions/utils';
import { estimateGasForTx, getOraclizePrice, estimateGas, _checkIfRefundAvailable } from '../modules/ethereumService';

export const addForm = async (dispatch, payload) => {
  dispatch({ type: ADD_FORM, payload });
};

export const updateFieldMeta = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_META, payload });
};

export const updateFieldError = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_ERROR, payload });
};

const setTxValues = (web3, dispatch, value, gas, gasPrice, usdPerEth, setVal = true) => {
  const txCostEth = web3.fromWei(gas * gasPrice);

  dispatch({ type: SET_TX_COST, payload: { eth: txCostEth, usd: txCostEth * usdPerEth } });

  if (!setVal) return;

  const txValEth = web3.fromWei(value);
  dispatch({ type: SET_TX_VAL, payload: { eth: txValEth, usd: txValEth * usdPerEth } });
};

export const setRegisterFormTxPrice = async (web3, contract, dispatch, getState) => {
  const oreclizeTransactionCost = await getOraclizePrice(contract);
  const value = oreclizeTransactionCost.toString();
  const contractMethod = contract.createUser;
  const usdPerEth = await getValOfEthInUsd();

  // mockup data here to give rough estimate of tx fee
  const params = [
    web3.toHex('J0EVFGVE2PCVAS3'),
    'BDk8K1PX/vOHQD1LqY+hMeEvDN0qIkv3N1UM6ly3TsltWus4jWj9CrNr1YRwIQuyV85kJhpqrtXRuuJQ7766DzggzthKyqEu5P/cM9xWkPycmoqROpwMgByolfYeE4eqWtY4vlGE/twjJ/' // eslint-disable-line
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(getState().forms.registerForm.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth);
};

export const setSendFormTxPrice = async (web3, contract, dispatch, getState) => {
  const form = getState().forms.sendForm;
  const value = web3.toWei(form.amount.value);
  const to = form.amount.to;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGas(web3, { to, value });
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, false);
};

export const setRefundFormTxPrice = async (web3, contract, dispatch, getState) => {
  const form = getState().forms.refundForm;
  const value = 0;
  const contractMethod = contract.refundMoneyForUser;
  const usdPerEth = await getValOfEthInUsd();
  const username = form.username.value;

  const isAvailable = await _checkIfRefundAvailable(web3, contract, username);

  if (isAvailable) { // TODO change this for production (TESTING ONLY!)
    dispatch({ type: REFUND_UNAVAILABLE });
    return;
  }

  dispatch({ type: REFUND_AVAILABLE });

  // mock data here in order to show gas
  const params = [web3.toHex(username)];
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  const gas = await estimateGasForTx(web3, contractMethod, params, value);

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, false);
};

export const setTipFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.tipForm;
  const value = web3.toWei(form.amount.value);
  const contractMethod = contract.tipUser;
  const author = state.modals.modalProps.author;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGasForTx(web3, contractMethod, [web3.toHex(author)], value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, false);
};

export const setBuyGoldFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.buyGoldForm;
  const months = form.months.value.toString();
  const contractMethod = contract.buyGold;
  const author = state.modals.modalProps.author;
  const usdPerEth = await getValOfEthInUsd();
  const address = state.account.address;

  const res = await fetch(
    `https://reddapp.decenter.com/gold.php?months=${months}&toUsername=${author}&fromAddress=${address}`
  );
  const data = await res.json();

  const value = web3.toWei(data.priceInEth.toString());

  const params = [
    web3.toHex(author), // bytes32 _to
    months, // string _months
    data.priceInUsd.toString(), // string _priceUsd
    data.nonce.toString(), // string _nonce
    data.signature, // string _signature
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth);
};
