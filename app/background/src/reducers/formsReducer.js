import { ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR } from '../../../constants/actionTypes';

const reducerName = 'forms';

const INITIAL_STATE = {};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ADD_FORM:
      return { ...state, [payload.name]: payload.state };

    case UPDATE_FIELD_META: {
      let currentForm = state[payload.formName];
      currentForm[payload.name] = payload.meta;
      return { ...state, [payload.formName]: currentForm };
    }

    case UPDATE_FIELD_ERROR: {
      let currentForm = state[payload.formName];
      let currentFiled = currentForm[payload.name];

      currentFiled.error = payload.error;
      currentForm[payload.name] = currentFiled;

      return { ...state, [payload.formName]: currentForm };
    }

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
