import { set, get } from '../../../customRedux/store';
import { createReducerData } from '../../../actions/utils';
import { TOGGLE_DROPDOWN } from '../../../constants/actionTypes';

const reducerName = 'networkDropdown';

const INITIAL_STATE = {
  visible: false
};

export const reducerData = createReducerData(reducerName, INITIAL_STATE);

export const reducer = async (storeParam, action) => {
  const payload = action.payload;

  const state = await get(reducerName);

  switch (action.type) {
    case TOGGLE_DROPDOWN:
      await set(reducerName, { ...state, visible: payload });
      break;

    default:
      await get(reducerName);
      break;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
