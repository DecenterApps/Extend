import { ACCEPT_NOTICE, COPIED_SEED } from '../constants/actionTypes';
import { changeView } from './userActions';
import { passwordReloader } from './keyStoreActions';

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
