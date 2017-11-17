import {
  NETWORK_UNAVAILABLE, VERIFIED_USER, REGISTER_USER_ERROR, SET_ACTIVE_TAB, GET_TIPS, GET_TIPS_SUCCESS,
  GET_TIPS_ERROR, CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR, ADD_NEW_TIP,
  ADD_NEW_GOLD, GET_GOLD, GET_GOLD_ERROR, GET_GOLD_SUCCESS, SET_REFUND_TIPS, DIALOG_OPEN, ADD_TAB_ID,
  REMOVE_TAB_ID, CLEAR_REGISTERING_ERROR, CLEAR_REGISTERING_USER
} from '../constants/actionTypes';
import {
  verifiedUserEvent, listenForTips, getTipsFromEvent, listenForGold, getGoldFromEvent, _checkIfRefundAvailable
} from '../modules/ethereumService';
import { changeView } from './permanentActions';

export const checkRefundForSentTips = async (web3, contract, getState, dispatch) => {
  const tips = [...getState().user.tips];

  if (tips.filter((tip) => tip.type === 'sent').length === 0) return;

  const tipsWithRefund = tips.map(async (tip) => {
    if (tip.type !== 'sent') return tip;

    const refundAvailable = await _checkIfRefundAvailable(web3, contract, web3.toHex(tip.to));

    if (refundAvailable) return Object.assign(tip, { refund: true });

    return tip;
  });

  const result = await Promise.all(tipsWithRefund);

  dispatch({ type: SET_REFUND_TIPS, payload: result });
};

const getTips = async (web3, contracts, dispatch, getState) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_TIPS });

  try {
    const tipsFromEvent = await getTipsFromEvent(web3, contracts, address, web3.toHex(username));
    const tips = [];

    if (tipsFromEvent.length > 0) {
      tipsFromEvent.forEach((tipParam) => {
        if ((tipParam.from === address) || (tipParam.from === username)) {
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
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_GOLD });

  try {
    const goldsFromEvent = await getGoldFromEvent(web3, contract, address, web3.toHex(username));
    const golds = [];

    if (goldsFromEvent.length > 0) {
      goldsFromEvent.forEach((goldParam) => {
        if ((goldParam.from === address) || (goldParam.from === username)) {
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
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  const handleNewTip = (tip) => {
    dispatch({ type: ADD_NEW_TIP, payload: { tip, address, username } });
  };

  getTips(web3, contracts, dispatch, getState);
  listenForTips(web3, contracts, dispatch, address, web3.toHex(username), handleNewTip);
};

export const handleGold = (web3, contracts, getState, dispatch) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  const handleNewGold = (gold) => {
    dispatch({ type: ADD_NEW_GOLD, payload: { gold, address, username } });
  };

  getGold(web3, contracts, dispatch, getState);
  listenForGold(web3, contracts, dispatch, address, web3.toHex(username), handleNewGold);
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
export const verifiedUser = async (web3, contracts, getState, dispatch, verifiedUsername) => {
  if (getState().permanent.registeringUsername) await dispatch({ type: CLEAR_REGISTERING_USER });

  await dispatch({ type: VERIFIED_USER, payload: verifiedUsername });
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
    const registeringUsername = getState().permanent.registeringUsername;

    if (web3.toUtf8(event.args.username) !== registeringUsername) return;

    verifiedUser(web3, contracts, getState, dispatch, registeringUsername);

    verifiedEvent.stopWatching(() => {});
    noMatchEvent.stopWatching(() => {});
  };

  const noMatchCallback = (err, event, verifiedEvent, noMatchEvent) => {
    if (web3.toUtf8(event.args.neededUsername) !== getState().permanent.registeringUsername) return;

    dispatch({ type: REGISTER_USER_ERROR, message: 'Verified username does not match reddit username.' });

    verifiedEvent.stopWatching(() => {});
    noMatchEvent.stopWatching(() => {});
  };

  verifiedUserEvent(web3, contracts.events, verifiedCallback, noMatchCallback);
};

export const openAuthWindow = (payload, dispatch) => {
  const width = 400;
  const height = 250;
  const left = 25;
  const top = 25;

  chrome.windows.create({
    url: chrome.extension.getURL('dialog.html'),
    focused: true,
    type: 'popup',
    width,
    height,
    left,
    top
  }, (window) => {
    dispatch({ type: DIALOG_OPEN, id: window.id });
  });
};

/**
 * Dispatches action to set that web3 could not connect to the network
 *
 * @param {Function} dispatch
 */
export const networkUnavailable = (dispatch, getState) =>
  new Promise(async (resolve) => {
    await dispatch({ type: NETWORK_UNAVAILABLE });
    await changeView(dispatch, getState, { viewName: 'networkUnavailable' });
    resolve();
  });

export const clearRegisteringError = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CLEAR_REGISTERING_ERROR });
    resolve();
  });

export const connectAgain = (dispatch) => { dispatch({ type: CONNECT_AGAIN }); };
export const connectingAgainError = (dispatch) => { dispatch({ type: CONNECT_AGAIN_ERROR }); };
export const connectingAgainSuccess = (dispatch) => { dispatch({ type: CONNECT_AGAIN_SUCCESS }); };

export const addTabId = (dispatch, getState, payload) => {
  if (getState().user.tabsIds.includes(payload)) return;

  dispatch({ type: ADD_TAB_ID, payload });
};

export const removeTabId = (dispatch, payload) => { dispatch({ type: REMOVE_TAB_ID, payload }); };
