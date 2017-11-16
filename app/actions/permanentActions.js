import { ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW, SET_DISCONNECTED, SEEN_DASH } from '../constants/actionTypes';
import { passwordReloader } from './keyStoreActions';

export const checkIfSeenDashboard = (dispatch, getState) =>
  new Promise(async (resolve) => {
    const state = getState();
    if (state.user.verifiedUsername && (state.permanent.view === 'dashboard') && !state.permanent.seenDash) {
      await dispatch({ type: SEEN_DASH });
    }

    resolve();
  });

export const changeView = (dispatch, getState, payload) =>
  new Promise(async (resolve) => {
    await checkIfSeenDashboard(dispatch, getState);

    await dispatch({ type: CHANGE_VIEW, payload });
    resolve();
  });

export const acceptNotice = (dispatch) => { dispatch({ type: ACCEPT_NOTICE }); };

/**
 * Dispatches action that the user has copied the seed
 *
 * @param {Function} dispatch
 */
export const copiedSeed = (dispatch, getState) => {
  dispatch({ type: COPIED_SEED });
  changeView(dispatch, getState, { viewName: 'dashboard' });
  passwordReloader(dispatch, getState);
};

export const setDisconnected = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: SET_DISCONNECTED, payload });
    resolve();
  });
