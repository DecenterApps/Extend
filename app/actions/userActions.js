import { verifiedUserEvent } from '../modules/ethereumService';
import {
  SET_NETWORK, SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE, NETWORK_UNAVAILABLE
} from '../constants/actionTypes';

/**
 * Sets Ethereum network if it is defined
 *
 * @param {Object} web3
 * @param {Function} dispatch
 */
export const setNetwork = (web3, dispatch) =>
  new Promise((resolve) => {
    web3.version.getNetwork(async (err, netId) => {
      if (err) {
        await dispatch({ type: SET_NETWORK, payload: '' });
        resolve();
      }

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

      await dispatch({ type: SET_NETWORK, payload: networkName });
      resolve();
    });
  });

/**
 * Dispatches action to change the current selected network
 *
 * @param {Function} dispatch
 * @param {Number} index - index of network in the constant NETWORKS array
 */
export const selectNetwork = (dispatch, index) =>
  new Promise(async (resolve) => {
    await dispatch({ type: SELECT_NETWORK, payload: index });
    resolve();
  });

/**
 * Dispatches action to accept privacy notice. The user only does this once
 * when the plugin is first loaded
 *
 * @param {Function} dispatch
 */
export const acceptPrivacyNotice = (dispatch) => {
  dispatch({ type: ACCEPT_PRIVACY_NOTICE });
};

/**
 * Listens for new verified users and checks if the current user is verified
 *
 * @param {Function} web3
 * @param {Object} contract
 */
export const listenForVerifiedUser = (web3, contract) => {
  console.log('LISTENING FOR VERIFIED USER');
  const cb = (err, val) => {
    console.log('VERIFIED USER EVENT', val);
  };

  verifiedUserEvent(web3, contract, cb);
};

/**
 * Dispatches action to set that web3 could not connect to the network
 *
 * @param {Function} dispatch
 */
export const networkUnavailable = (dispatch) => {
  dispatch({ type: NETWORK_UNAVAILABLE });
};
