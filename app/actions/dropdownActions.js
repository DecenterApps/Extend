import { TOGGLE_DROPDOWN } from '../constants/actionTypes';

export const toggleDropdown = (dispatch, toggleAction) => {
  dispatch({ type: TOGGLE_DROPDOWN, payload: toggleAction });
};
