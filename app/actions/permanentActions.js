import { ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW } from '../constants/actionTypes';
import { passwordReloader } from './keyStoreActions';

export const changeView = (dispatch, payload) =>
  new Promise(async (resolve) => {
    await dispatch({ type: CHANGE_VIEW, payload });
    resolve();
  });

export const acceptNotice = (dispatch) => { dispatch({ type: ACCEPT_NOTICE }); };

/**
 * Dispatches action that the user has copied the seed
 *
 * @param {Function} dispatch
 */
export const copiedSeed = (dispatch) => {
  dispatch({ type: COPIED_SEED });
  changeView(dispatch, { viewName: 'dashboard' });
  passwordReloader(dispatch);
};
