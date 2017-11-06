import { ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR } from '../constants/actionTypes';

export const addForm = async (dispatch, payload) => {
  dispatch({ type: ADD_FORM, payload });
};

export const updateFieldMeta = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_META, payload });
};

export const updateFieldError = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_ERROR, payload });
};
