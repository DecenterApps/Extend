import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { getParameterByName } from '../actions/utils';
import { verifiedUserEvent, _createUser } from '../modules/ethereumService';
import {
  SET_NETWORK, SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE, NETWORK_UNAVAILABLE,
  REGISTER_USER, VERIFIED_USER, REGISTER_USER_ERROR
} from '../constants/actionTypes';

const keyStore = lightwallet.keystore;

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
 * Dispatches action to set that the address is verified
 *
 * @param {Function} dispatch
 */
export const verifiedUser = (dispatch) => {
  dispatch({ type: VERIFIED_USER });
};

/**
 * Listens for new verified users and checks if the current user is verified
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const listenForVerifiedUser = (web3, contract, dispatch, getState) => {
  console.log('LISTENING FOR VERIFIED USER');
  const cb = (err, event) => {
    if (event.args.username !== getState().user.registeringUsername) return;
    console.log('VERIFIED USER');
    verifiedUser(dispatch);
  };

  verifiedUserEvent(web3, contract, cb);
};

/**
 * Opens Reddit oauth window and receives user access_token. Access_token and
 * user address are sent to the contract
 *
 * @param {Object} contract
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const createUserAuth = (contract, web3, getState, dispatch) => {
  const redirectUri = chrome.identity.getRedirectURL('oauth2');
  const account = getState().account;
  const ks = keyStore.deserialize(account.keyStore);
  const address = account.address;
  const password = account.password;

  chrome.identity.launchWebAuthFlow({
    url: `https://www.reddit.com/api/v1/authorize?client_id=AFH0yVxKuLUlVQ&response_type=token&state=asdf&redirect_uri=${redirectUri}&scope=identity`, // eslint-disable-line
    interactive: true
  }, async (authResponse) => {
    if (!authResponse) return;

    const response = authResponse.replace(/#/g, '?');
    const accessToken = getParameterByName('access_token', response);

    const request = new Request('https://oauth.reddit.com/api/v1/me', {
      headers: new Headers({
        'Authorization': `bearer ${accessToken}`
      })
    });

    try {
      const redditMeResponse = await fetch(request);
      const me = await redditMeResponse.json();

      if (me.error) {
        await dispatch({ type: REGISTER_USER_ERROR });
        return;
      }

      await _createUser(contract, web3, me.name, accessToken, ks, address, password);
      await dispatch({ type: REGISTER_USER, payload: me.name });

      listenForVerifiedUser(web3, contract, dispatch, getState);
    } catch (err) {
      dispatch({ type: REGISTER_USER_ERROR });
    }
  });
};


/**
 * Dispatches action to set that web3 could not connect to the network
 *
 * @param {Function} dispatch
 */
export const networkUnavailable = (dispatch) => {
  dispatch({ type: NETWORK_UNAVAILABLE });
};
