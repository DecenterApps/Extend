import { checkIfUserVerified } from '../modules/ethereumService';
import {
  SET_NETWORK, SET_ADDRESS, SET_IS_USER_VERIFIED, SELECT_NETWORK,
  ACCEPT_PRIVACY_NOTICE
} from '../constants/actionTypes';

/**
 * Sets Ethereum network if it is defined
 *
 * @param {Object} web3
 * @param {Function} dispatch
 */
export const setNetwork = (web3, dispatch) => {
  web3.version.getNetwork((err, netId) => {
    if (err) return dispatch({ type: SET_NETWORK, payload: '' });

    let networkName = '';

    switch (netId) {
      case '1':
        networkName = 'mainnet';
        break;
      case '2':
        networkName = 'morden';
        break;
      case '3':
        networkName = 'ropsten';
        break;
      case '4':
        networkName = 'rinkeby';
        break;
      case '42':
        networkName = 'kovan';
        break;
      default:
        networkName = 'unknown';
    }

    return dispatch({ type: SET_NETWORK, payload: networkName });
  });
};

/**
 * Checks if the users address is associated to a Reddit username on the contract
 *
 * @param {Object} contract
 * @param {Function} dispatch
 */
export const checkIfAddressHasUser = async (contract, dispatch) => {
  const isUserVerified = await checkIfUserVerified(contract);
  dispatch({ type: SET_IS_USER_VERIFIED, payload: isUserVerified });
};

/**
 * Checks if the current node has an address, if it does, checks if it is same
 * as the current address in the state. If it is different sets it as the new state address
 *
 * @param {Object} contract
 * @param {String} currentAddress
 * @param {Function} dispatch
 * @param {Object} web3
 */
export const setAddress = (contract, currentAddress, dispatch, web3) => {
  if (!web3.eth.accounts[0]) {
    dispatch({ type: SET_ADDRESS, payload: '' });
    return false;
  }

  const newAddress = web3.eth.accounts[0];

  if (newAddress !== currentAddress) return false;

  web3.eth.defaultAccount = newAddress;
  checkIfAddressHasUser(contract, dispatch);
  dispatch({ type: SET_ADDRESS, payload: newAddress });
  return true;
};

/**
 * Dispatches action to change the current selected network
 *
 * @param {Function} dispatch
 * @param {Number} index - index of network in the constant NETWORKS array
 */
export const selectNetwork = (dispatch, index) => {
  dispatch({ type: SELECT_NETWORK, payload: index });
};

/**
 * Dispatches action to accept privacy notice. The user only does this once
 * when the plugin is first loaded
 *
 * @param {Function} dispatch
 */
export const acceptPrivacyNotice = (dispatch) => {
  dispatch({ type: ACCEPT_PRIVACY_NOTICE });
};
