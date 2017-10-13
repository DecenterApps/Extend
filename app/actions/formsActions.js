import { ADD_FORM, UPDATE_FIELD_META } from '../constants/actionTypes';

export const addForm = async (dispatch, payload) => {
  dispatch({ type: ADD_FORM, payload });
};

export const updateFieldMeta = async (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_META, payload });
};
