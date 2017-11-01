import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { getParameterByName } from '../actions/utils';
import {
  verifiedUserEvent, _createUser, getSentTipsFromEvent, getReceivedTipsFromEvent
} from '../modules/ethereumService';
import { pollTipsBalance } from './accountActions';
import {
  NETWORK_UNAVAILABLE,
  REGISTER_USER, VERIFIED_USER, REGISTER_USER_ERROR, SET_ACTIVE_TAB, GET_SENT_TIPS, GET_SENT_TIPS_SUCCESS,
  GET_SENT_TIPS_ERROR, GET_RECEIVED_TIPS, GET_RECEIVED_TIPS_SUCCESS, GET_RECEIVED_TIPS_ERROR, CHANGE_VIEW,
  CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR
} from '../constants/actionTypes';

const keyStore = lightwallet.keystore;

export const changeView = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CHANGE_VIEW, payload });
    resolve();
  });


/**
 * Dispatches action to set the current active content tab
 *
 * @param {Function} dispatch
 * @param {String} selectedTab
 */
export const setTab = (dispatch, selectedTab) => {
  dispatch({ type: SET_ACTIVE_TAB, payload: selectedTab });
};

/**
 * Dispatches action to set that the address is verified
 *
 * @param {Function} dispatch
 */
export const verifiedUser = (web3, contract, getState, dispatch) => {
  dispatch({ type: VERIFIED_USER });
  pollTipsBalance(web3, contract, dispatch, getState);
};

/**
 * Listens for new verified users and checks if the current user is verified
 *
 * @param {Object} web3
 * @param {Array} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const listenForVerifiedUser = (web3, contracts, dispatch, getState) => {
  console.log('LISTENING FOR VERIFIED USER');
  const cb = (err, event, eventInstance) => {
    if (web3.toUtf8(event.args.username) !== getState().user.registeringUsername) return;

    eventInstance.stopWatching();
    verifiedUser(web3, contracts.func, getState, dispatch);
  };

  verifiedUserEvent(web3, contracts.events, cb);
};

/**
 * Opens Reddit oauth window and receives user access_token. Access_token and
 * user address are sent to the contract
 *
 * @param {Array} contracts
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const createUserAuth = (contracts, web3, getState, dispatch) => {
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

      const gasPrice = web3.toWei(getState().forms.registerForm.gasPrice.value, 'gwei');

      await _createUser(contracts.func, web3, me.name, accessToken, ks, address, password, gasPrice);
      await dispatch({
        type: REGISTER_USER,
        payload: { username: me.name }
      });

      listenForVerifiedUser(web3, contracts, dispatch, getState);
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
export const networkUnavailable = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: NETWORK_UNAVAILABLE });
    await changeView(dispatch, { viewName: 'networkUnavailable' });
    resolve();
  });

export const getSentTips = async (web3, contract, dispatch, getState) => {
  dispatch({ type: GET_SENT_TIPS });

  try {
    const sentTips = await getSentTipsFromEvent(web3, contract, getState().account.address);
    dispatch({ type: GET_SENT_TIPS_SUCCESS, payload: sentTips });
  } catch(err) {
    dispatch({ type: GET_SENT_TIPS_ERROR });
  }
};

export const getReceivedTips = async (web3, contract, dispatch, getState) => {
  dispatch({ type: GET_RECEIVED_TIPS });

  try {
    const receivedTips = await getReceivedTipsFromEvent(web3, contract, getState().user.verifiedUsername);
    dispatch({ type: GET_RECEIVED_TIPS_SUCCESS, payload: receivedTips });
  } catch(err) {
    dispatch({ type: GET_RECEIVED_TIPS_ERROR });
  }
};

export const connectAgain = (dispatch) => { dispatch({ type: CONNECT_AGAIN }); };
export const connectingAgainError = (dispatch) => { dispatch({ type: CONNECT_AGAIN_ERROR }); };
export const connectingAgainSuccess = (dispatch) => { dispatch({ type: CONNECT_AGAIN_SUCCESS }); };

