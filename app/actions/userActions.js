import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { getParameterByName, encryptTokenOreclize } from '../actions/utils';
import {
  NETWORK_UNAVAILABLE,
  REGISTER_USER, VERIFIED_USER, REGISTER_USER_ERROR, SET_ACTIVE_TAB, GET_TIPS, GET_TIPS_SUCCESS,
  GET_TIPS_ERROR, CHANGE_VIEW, CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR, ADD_NEW_TIP,
  ADD_NEW_GOLD, GET_GOLD, GET_GOLD_ERROR, GET_GOLD_SUCCESS, SET_DISCONNECTED
} from '../constants/actionTypes';
import {
  verifiedUserEvent, sendTransaction, listenForTips, getTipsFromEvent, listenForGold, getGoldFromEvent,
  getOraclizePrice
} from '../modules/ethereumService';

const keyStore = lightwallet.keystore;

export const changeView = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CHANGE_VIEW, payload });
    resolve();
  });

const getTips = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const address = state.account.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_TIPS });

  try {
    const tipsFromEvent = await getTipsFromEvent(web3, contract, address, web3.toHex(username));
    const tips = [];

    if (tipsFromEvent.length > 0) {
      tipsFromEvent.forEach((tipParam) => {
        if (tipParam.from === address) {
          const tip = Object.assign({}, tipParam);
          tip.type = 'sent';
          tips.push(tip);
        }

        if (tipParam.to === username) {
          const tip = Object.assign({}, tipParam);
          tip.type = 'received';
          tips.push(tip);
        }
      });
    }

    dispatch({ type: GET_TIPS_SUCCESS, payload: tips });
  } catch(err) {
    dispatch({ type: GET_TIPS_ERROR });
  }
};

const getGold = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const address = state.account.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_GOLD });

  try {
    const goldsFromEvent = await getGoldFromEvent(web3, contract, address, web3.toHex(username));
    const golds = [];

    if (goldsFromEvent.length > 0) {
      goldsFromEvent.forEach((goldParam) => {
        if (goldParam.from === address) {
          const gold = Object.assign({}, goldParam);
          gold.type = 'sent';
          golds.push(gold);
        }

        if (goldParam.to === username) {
          const gold = Object.assign({}, goldParam);
          gold.type = 'received';
          golds.push(gold);
        }
      });
    }

    dispatch({ type: GET_GOLD_SUCCESS, payload: golds });
  } catch(err) {
    dispatch({ type: GET_GOLD_ERROR });
  }
};

export const handleTips = (web3, contracts, getState, dispatch) => {
  const state = getState();
  const address = state.account.address;
  const username = state.user.verifiedUsername;

  const handleNewTip = (tip) => {
    dispatch({ type: ADD_NEW_TIP, payload: { tip, address, username } });
  };

  getTips(web3, contracts.events, dispatch, getState);
  listenForTips(web3, contracts.events, dispatch, address, web3.toHex(username), handleNewTip);
};

export const handleGold = (web3, contracts, getState, dispatch) => {
  const state = getState();
  const address = state.account.address;
  const username = state.user.verifiedUsername;

  const handleNewGold = (gold) => {
    dispatch({ type: ADD_NEW_GOLD, payload: { gold, address, username } });
  };

  getGold(web3, contracts.events, dispatch, getState);
  listenForGold(web3, contracts.events, dispatch, address, web3.toHex(username), handleNewGold);
};

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
export const verifiedUser = async (web3, contracts, getState, dispatch) => {
  await dispatch({ type: VERIFIED_USER });
  handleTips(web3, contracts, getState, dispatch);
  handleGold(web3, contracts, getState, dispatch);
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

  const verifiedCallback = (err, event, verifiedEvent, noMatchEvent) => {
    if (web3.toUtf8(event.args.username) !== getState().user.registeringUsername) return;

    verifiedUser(web3, contracts, getState, dispatch);

    verifiedEvent.stopWatching(() => {});
    noMatchEvent.stopWatching(() => {});
  };

  const noMatchCallback = (err, event, verifiedEvent, noMatchEvent) => {
    if (web3.toUtf8(event.args.neededUsername) !== getState().user.registeringUsername) return;

    dispatch({ type: REGISTER_USER_ERROR });

    verifiedEvent.stopWatching(() => {});
    noMatchEvent.stopWatching(() => {});
  };

  verifiedUserEvent(web3, contracts.events, verifiedCallback, noMatchCallback);
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
      const contracMethod = contracts.func.createUser;
      const oreclizeTransactionCost = await getOraclizePrice(contracts.func);
      const value = oreclizeTransactionCost.toString();
      const encryptedToken = await encryptTokenOreclize(accessToken);
      const params = [web3.toHex(me.name), encryptedToken];

      await sendTransaction(web3, contracMethod, ks, address, password, params, value, gasPrice);

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

export const connectAgain = (dispatch) => { dispatch({ type: CONNECT_AGAIN }); };
export const connectingAgainError = (dispatch) => { dispatch({ type: CONNECT_AGAIN_ERROR }); };
export const connectingAgainSuccess = (dispatch) => { dispatch({ type: CONNECT_AGAIN_SUCCESS }); };

export const setDisconnected = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: SET_DISCONNECTED, payload });
    resolve();
  });

