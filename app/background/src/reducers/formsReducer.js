import { ADD_FORM } from '../../../constants/actionTypes';

const reducerName = 'forms';

const INITIAL_STATE = {};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ADD_FORM:
      return { ...state, [payload.formName]: payload.formState };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
