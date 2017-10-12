import { ADD_FORM } from '../constants/actionTypes';

export const addForm = (dispatch, payload) => {
  dispatch({ type: ADD_FORM, payload });
};
