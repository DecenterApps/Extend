import {
  ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW, SET_DISCONNECTED, SEEN_DASH, CLEAR_UNLOCK_ERROR
} from '../constants/actionTypes';
import { passwordReloader } from './keyStoreActions';
import { clearSendValues, clearRefundValues } from './accountActions';

/**
 * Checks if the user has been to the dashboard after verification at least once. Dispatches
 * action that confirms that the user has seen the dashboard
 *
 * @param {Function} dispatch
 * @param {Function} getState
 * @return {Promise}
 */
export const checkIfSeenDashboard = (dispatch, getState) =>
  new Promise(async (resolve) => {
    const state = getState();
    if (state.user.verifiedUsername && (state.permanent.view === 'dashboard') && !state.permanent.seenDash) {
      await dispatch({ type: SEEN_DASH });
    }

    resolve();
  });

/**
 * Dispatches action to change the current view. Here are dispatched certain actions that need to be fired
 * when switching from a certain view
 *
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {Object} payload -  { viewName }
 * @return {Promise}
 */
export const changeView = (dispatch, getState, payload) =>
  new Promise(async (resolve) => {
    const state = getState();
    await checkIfSeenDashboard(dispatch, getState);
    if (state.permanent.view === 'send') await clearSendValues(dispatch);
    if (state.permanent.view === 'refund') await clearRefundValues(dispatch);
    if (state.keyStore.created && (state.permanent.view === 'importAccount')) {
      await dispatch({ type: CLEAR_UNLOCK_ERROR });
    }

    await dispatch({ type: CHANGE_VIEW, payload });
    resolve();
  });

/**
 * Dispatches action to accept that the user has read the TOA
 *
 * @param {Function} dispatch
 */
export const acceptNotice = (dispatch) => { dispatch({ type: ACCEPT_NOTICE }); };

/**
 * Dispatches action that the user has copied the seed phrase and initiates the password reloader
 *
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const copiedSeed = (dispatch, getState) => {
  dispatch({ type: COPIED_SEED });
  changeView(dispatch, getState, { viewName: 'dashboard' });
  passwordReloader(dispatch, getState);
};

/**
 * Dispatches action that the user cannot or can interact with the blockchain
 *
 * @param {Function} dispatch
 * @param {Boolean} payload
 * @return {Promise}
 */
export const setDisconnected = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: SET_DISCONNECTED, payload });
    resolve();
  });
