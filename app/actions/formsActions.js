import {
  ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR, SET_TX_COST, REFUND_UNAVAILABLE, REFUND_AVAILABLE,
  UPDATE_FORM
} from '../constants/actionTypes';
import { getValOfEthInUsd } from '../actions/utils';
import { estimateGasForTx, estimateGas, _getOraclizePrice, _checkIfRefundAvailable } from '../modules/ethereumService';

/**
 * Dispatches action to register form in reducer before it loads
 *
 * @param {Function} dispatch
 * @param {String} payload - form name
 */
export const addForm = async (dispatch, payload) => { dispatch({ type: ADD_FORM, payload }); };

/**
 * Dispatches action to update form with new fields
 *
 * @param {Function} dispatch
 * @param {Object} payload - { name, state }
 */
export const updateForm = async (dispatch, payload) => { dispatch({ type: UPDATE_FORM, payload }); };

/**
 * Dispatches action to set a certain fields metadata
 *
 * @param {Function} dispatch
 * @param {Object} payload - { formName, meta: { error, touched, value } }
 */
export const updateFieldMeta = (dispatch, payload) => { dispatch({ type: UPDATE_FIELD_META, payload }); };

/**
 * Dispatches action to set a certain fields error metadata
 *
 * @param {Function} dispatch
 * @param {Object} payload - { formName, name: fieldName, error: errorsParam[fieldName] }
 */
export const updateFieldError = (dispatch, payload) => { dispatch({ type: UPDATE_FIELD_ERROR, payload }); };

/**
 * Calculates if the user has enough ETH in balance to pay for a certain form submit that interacts
 * with the contract. Dispatches action to set a certain forms tx cost and insufficient balance valuation
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {String} value - additional value to be sent to contract in wei
 * @param {Number} gas
 * @param {Number} gasPrice
 * @param {Number} usdPerEth - current USD/ETH exchange rate from the server
 * @param {String} balance
 * @param {String} formName
 * @param {Object} additionalData - data to be included into currentFormTxCost for versioning
 */
const setTxValues = (web3, dispatch, value, gas, gasPrice, usdPerEth, balance, formName, additionalData = null) => {
  const txCostEth = web3.fromWei((gas * gasPrice) + parseFloat(value));
  const insufficientBalance = (parseFloat(balance) - parseFloat(txCostEth)) < 0;

  dispatch({
    type: SET_TX_COST,
    payload: {
      currentFormTxCost: {
        eth: txCostEth,
        usd: (txCostEth * usdPerEth).toFixed(2),
      },
      insufficientBalance,
      formName,
      additionalData
    }
  });
};

/**
 * Calculates the data needed for setTxValues for the registerForm. Mocks data because can't estimate with
 * dynamic values.
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setRegisterFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const oreclizeTransactionCost = await _getOraclizePrice(contract);
  const value = oreclizeTransactionCost.toString();
  const contractMethod = contract.createUser;
  const usdPerEth = await getValOfEthInUsd();

  // Mockup data here to give rough estimate of tx fee
  const params = [
    web3.toHex('J0EVFGVE2PCVAS3'),
    'BDk8K1PX/vOHQD1LqY+hMeEvDN0qIkv3N1UM6ly3TsltWus4jWj9CrNr1YRwIQuyV85kJhpqrtXRuuJQ7766DzggzthKyqEu5P/cM9xWkPycmoqROpwMgByolfYeE4eqWtY4vlGE/twjJ/' // eslint-disable-line
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(state.forms.registerForm.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance, 'registerForm');
};

/**
 * Calculates the data needed for setTxValues for the old user form
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setOldUserFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const contractMethod = contract.createOldUser;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGasForTx(web3, contractMethod, [], 0);
  const gasPrice = parseFloat(web3.toWei(state.forms.oldUserForm.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, '0', gas, gasPrice, usdPerEth, balance, 'oldUserForm');
};

/**
 * Calculates the data needed for setTxValues for the send form
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setSendFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.sendForm;
  const balance = state.account.balance;
  const value = web3.toWei(form.amount.value);
  const to = form.amount.to;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGas(web3, { to, value });
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance, 'sendForm');
};

/**
 * Calculates the data needed for setTxValues for the refund form
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setRefundFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.refundForm;
  const balance = state.account.balance;
  const value = 0;
  const contractMethod = contract.refundMoneyForUser;
  const usdPerEth = await getValOfEthInUsd();
  const username = state.account.refundTipUsername;

  const isAvailable = await _checkIfRefundAvailable(web3, contract, username, 'refundForm');

  if (!isAvailable) {
    dispatch({ type: REFUND_UNAVAILABLE });
    return;
  }

  dispatch({ type: REFUND_AVAILABLE });

  // mock data here in order to show gas
  const params = [web3.toHex(username)];
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  const gas = await estimateGasForTx(web3, contractMethod, params, value);

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};

/**
 * Calculates the data needed for setTxValues for the tip form
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setTipFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const form = state.forms.tipForm;
  const value = web3.toWei(form.amount.value);
  const contractMethod = contract.tipUser;
  const author = state.modals.modalProps.author;
  const id = state.modals.modalProps.id;
  const usdPerEth = await getValOfEthInUsd();

  const params = [
    web3.toHex(author), // bytes32 _username
    web3.toHex(id) // bytes32 _commentId
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance, 'tipForm');
};

/**
 * Calculates the data needed for setTxValues for the buy gold form
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch - dispatch
 * @param {Function} getState - dispatch
 */
export const setBuyGoldFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const form = state.forms.buyGoldForm;
  const months = form.months.value.toString();
  const contractMethod = contract.buyGold;
  const author = state.modals.modalProps.author;
  const id = state.modals.modalProps.id;
  const usdPerEth = await getValOfEthInUsd();
  const address = state.keyStore.address;

  const res = await fetch(
    `https://reddapp.decenter.com/gold.php?months=${months}&toUsername=${author}&fromAddress=${address}&id=${id}`
  );
  const data = await res.json();

  const value = web3.toWei(data.priceInEth.toString());

  const params = [
    web3.toHex(author), // bytes32 _to
    months, // string _months
    id, // string _commentId
    data.priceInUsd.toString(), // string _priceUsd
    data.nonce.toString(), // string _nonce
    data.signature, // string _signature
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance, 'buyGoldForm', { months });
};
