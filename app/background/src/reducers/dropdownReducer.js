import { TOGGLE_DROPDOWN } from '../../../constants/actionTypes';

const reducerName = 'networkDropdown';

const INITIAL_STATE = {
  visible: false
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case TOGGLE_DROPDOWN:
      return { ...state, visible: payload };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
