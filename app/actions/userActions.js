import lightwallet from 'eth-lightwallet';
import {
  NETWORK_UNAVAILABLE, VERIFIED_USER, REGISTER_USER_ERROR, SET_ACTIVE_TAB, GET_TIPS, GET_TIPS_SUCCESS,
  GET_TIPS_ERROR, CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR, ADD_NEW_TIP,
  ADD_NEW_GOLD, GET_GOLD, GET_GOLD_ERROR, GET_GOLD_SUCCESS, SET_REFUND_TIPS, DIALOG_OPEN, ADD_TAB_ID,
  REMOVE_TAB_ID, CLEAR_REGISTERING_ERROR, CLEAR_REGISTERING_USER, CLEAR_VERIFIED, SET_OLD_USER, CLEAR_OLD_USER,
  MIGRATE_USER, CLEAR_MIGRATING_USER
} from '../constants/actionTypes';
import {
  verifiedUserEvent, listenForTips, getTipsFromEvent, listenForGold, getGoldFromEvent, _checkIfRefundAvailable,
  _checkAddressVerified, _getUsernameForAddress, _checkIfOldUser, sendTransaction, getBlock
} from '../modules/ethereumService';
import { formatTime } from './utils';

const keyStore = lightwallet.keystore;

/**
 * Every time the user comes to the tips history tab in the main view
 * this function checks if any of the tips can be refunded
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Function} getState
 * @param {Function} dispatch
 */
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

/**
 * Gets all the tips for the user from the event and dispatches action to set them
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
const getTips = async (web3, contracts, dispatch, getState) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_TIPS });

  try {
    const tipsFromEvent = await getTipsFromEvent(web3, contracts, address, web3.toHex(username));
    const tips = [];

    if (tipsFromEvent.length > 0) {
      tipsFromEvent.forEach(async (_tip) => {
        let type = '';

        if ((_tip.from === address) || (_tip.from === username)) type = 'sent';

        if (_tip.to === username) type = 'received';

        if (!type) return;

        const tip = Object.assign({}, _tip);
        const block = await getBlock(web3, tip.block);
        console.log('block', block);
        tip.time = formatTime(block.timestamp);
        tip.type = type;
        tips.push(tip);
      });
    }

    dispatch({ type: GET_TIPS_SUCCESS, payload: tips });
  } catch(err) {
    dispatch({ type: GET_TIPS_ERROR });
  }
};

/**
 * Gets all the gold transactions for the user from the event and dispatches action to set them
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
const getGold = async (web3, contracts, dispatch, getState) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  dispatch({ type: GET_GOLD });

  try {
    const goldsFromEvent = await getGoldFromEvent(web3, contracts, address, web3.toHex(username));
    const golds = [];

    if (goldsFromEvent.length > 0) {
      goldsFromEvent.forEach(async (_gold) => {
        let type = '';

        if ((_gold.from === address) || (_gold.from === username)) type = 'sent';

        if (_gold.to === username) type = 'received';

        if (!type) return;

        const gold = Object.assign({}, _gold);
        const block = await getBlock(web3, gold.block);
        gold.time = formatTime(block.timestamp);
        gold.type = type;
        golds.push(gold);
      });
    }

    dispatch({ type: GET_GOLD_SUCCESS, payload: golds });
  } catch(err) {
    dispatch({ type: GET_GOLD_ERROR });
  }
};

/**
 * Handles tips logic when the user is verified or on app start/restart. Gets current tips
 * and initiates the new tips listener
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const handleTips = (web3, contracts, getState, dispatch) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  const handleNewTip = (tip) => {
    const tips = [...getState().user.tips];

    if ((tip.from === address) || (tip.from === username)) {
      const sentTip = Object.assign({}, tip);
      sentTip.type = 'sent';
      tips.unshift(sentTip);
    }

    if (tip.to === username) {
      const receivedTip = Object.assign({}, tip);
      receivedTip.type = 'received';
      tips.unshift(receivedTip);
    }

    if (JSON.stringify(getState().user.tips) === JSON.stringify(tips)) return;

    dispatch({ type: ADD_NEW_TIP, payload: tips });
  };

  getTips(web3, contracts, dispatch, getState);
  listenForTips(web3, contracts, dispatch, address, web3.toHex(username), handleNewTip);
};


/**
 * Handles gold logic when the user is verified or on app start/restart. Gets current golds
 * and initiates the new gold listener
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const handleGold = (web3, contracts, getState, dispatch) => {
  const state = getState();
  const address = state.keyStore.address;
  const username = state.user.verifiedUsername;

  const handleNewGold = (gold) => {
    const golds = [...getState().user.golds];

    if ((gold.from === address) || (gold.from === username)) {
      const sentGold = Object.assign({}, gold);
      sentGold.type = 'sent';
      golds.unshift(sentGold);
    }

    if (gold.to === username) {
      const receivedGold = Object.assign({}, gold);
      receivedGold.type = 'received';
      golds.unshift(receivedGold);
    }

    if (JSON.stringify(getState().user.golds) === JSON.stringify(golds)) return;

    dispatch({ type: ADD_NEW_GOLD, payload: golds });
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
export const setTab = (dispatch, selectedTab) => { dispatch({ type: SET_ACTIVE_TAB, payload: selectedTab }); };

/**
 * Dispatches action to set that the address is verified. Calls the gold and tips handlers.
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} getState
 * @param {Function} dispatch
 * @param {String} verifiedUsername - the new verified username
 */
export const verifiedUser = async (web3, contracts, getState, dispatch, verifiedUsername) => {
  const permanentState = getState().permanent;
  if (permanentState.registeringUsername) await dispatch({ type: CLEAR_REGISTERING_USER });
  if (permanentState.migratingUsername) await dispatch({ type: CLEAR_MIGRATING_USER });

  await dispatch({ type: VERIFIED_USER, payload: verifiedUsername });
  handleTips(web3, contracts, getState, dispatch);
  handleGold(web3, contracts, getState, dispatch);
};

/**
 * Listens for new verified users and checks if the current registering username is verified
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const listenForVerifiedUser = (web3, contracts, dispatch, getState) => {
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

/**
 * Listens for new verified users when user is migrating verified username from old contract
 * to the new contract
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const listenForMigratingUser = (web3, contracts, dispatch, getState) => {
  const verifiedCallback = (err, event, verifiedEvent, noMatchEvent) => {
    const migratingUsername = getState().permanent.migratingUsername;

    if (web3.toUtf8(event.args.username) !== migratingUsername) return;

    verifiedUser(web3, contracts, getState, dispatch, migratingUsername);

    verifiedEvent.stopWatching(() => {});
    noMatchEvent.stopWatching(() => {});
  };

  const noMatchCallback = () => {};

  verifiedUserEvent(web3, contracts.events, verifiedCallback, noMatchCallback);
};

/**
 * Opens the apps authentication window that opens the reddit authentication window
 *
 * @param {Object} payload - { screenWidth, screenHeight }
 * @param {Function} dispatch
 */
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
 * @return {Promise}
 */
export const networkUnavailable = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: NETWORK_UNAVAILABLE });
    resolve();
  });

/**
 * Dispatches action to clear error received from reddit authentication window.
 *
 * @param {Function} dispatch
 * @return {Promise}
 */
export const clearRegisteringError = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CLEAR_REGISTERING_ERROR });
    resolve();
  });

/**
 * Dispatches action to update the state that the user is trying to connect to the network
 *
 * @param {Function} dispatch
 */
export const connectAgain = (dispatch) => { dispatch({ type: CONNECT_AGAIN }); };

/**
 * Dispatches action set that the user could not connect to the network
 *
 * @param {Function} dispatch
 */
export const connectingAgainError = (dispatch) => { dispatch({ type: CONNECT_AGAIN_ERROR }); };

/**
 * Dispatches action set that the user was successful in connecting to the network
 *
 * @param {Function} dispatch
 */
export const connectingAgainSuccess = (dispatch) => { dispatch({ type: CONNECT_AGAIN_SUCCESS }); };

/**
 * Dispatches action to add a new tab id (content script tab id) if it is not already added
 *
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {Number} payload
 */
export const addTabId = (dispatch, getState, payload) => {
  if (getState().user.tabsIds.includes(payload)) return;

  dispatch({ type: ADD_TAB_ID, payload });
};

/**
 * Dispatches action to remove a ab id (content script tab id)
 *
 * @param {Function} dispatch
 * @param {Number} payload
 */
export const removeTabId = (dispatch, payload) => { dispatch({ type: REMOVE_TAB_ID, payload }); };

/**
 * Checks if user is verified or registering and loads state accordingly
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {Object} contracts
 */
export const handleUserVerification = (web3, dispatch, getState, contracts) =>
  new Promise(async (resolve, reject) => {
    const state = getState();

    try {
      if (!state.keyStore.address) {
        resolve();
        return;
      }

      const oldUsername = web3.toUtf8(await _checkIfOldUser(web3, contracts.func));
      const verified = await _checkAddressVerified(web3, contracts.func);

      if (verified) {
        const verifiedUsername = await _getUsernameForAddress(web3, contracts.func, state.keyStore.address);
        verifiedUser(web3, contracts, getState, dispatch, web3.toUtf8(verifiedUsername));
      } else {
        dispatch({ type: CLEAR_VERIFIED });
      }

      if (!verified && state.permanent.registeringUsername) {
        listenForVerifiedUser(web3, contracts, dispatch, getState);
      }

      if (oldUsername && !state.permanent.migratingUsername && !verified && !state.permanent.registeringUsername) {
        dispatch({ type: SET_OLD_USER, payload: oldUsername });
      } else {
        dispatch({ type: CLEAR_OLD_USER });
      }

      if (oldUsername && state.permanent.migratingUsername) {
        listenForMigratingUser(web3, contracts, dispatch, getState);
      }

      resolve();
    } catch(err) {
      reject(err);
    }
  });

/**
 * Migrates verified username from old contract to the new one
 *
 * @param {Object} web3
 * @param {Object} contracts
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const createOldUser = async (web3, contracts, dispatch, getState) => {
  const state = getState();
  const keyStoreState = state.keyStore;
  const ks = keyStore.deserialize(keyStoreState.keyStore);
  const address = keyStoreState.address;
  const password = keyStoreState.password;
  const gasPrice = web3.toWei(state.forms.oldUserForm.gasPrice.value, 'gwei');
  const contractMethod = contracts.func.createOldUser;

  try {
    await sendTransaction(web3, contractMethod, ks, address, password, null, 0, gasPrice);

    await dispatch({ type: MIGRATE_USER, payload: state.user.oldUsername });
    await dispatch({ type: CLEAR_OLD_USER });

    listenForMigratingUser(web3, contracts, dispatch, getState);
  } catch(err) {
    throw Error(err);
  }
};
