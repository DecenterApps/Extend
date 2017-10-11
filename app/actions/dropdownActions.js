import { TOGGLE_DROPDOWN } from '../constants/actionTypes';

/**
 * Dispatches action to close or open dropdown
 *
 * @param {Function} dispatch
 * @param {Boolean} toggleAction - true if open dropdown, false if close dropdown
 */
export const toggleDropdown = (dispatch, toggleAction) => {
  dispatch({ type: TOGGLE_DROPDOWN, payload: toggleAction });
};
