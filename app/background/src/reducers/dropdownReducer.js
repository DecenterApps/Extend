import { set, get, clearAll } from '../../../actions/storageActions';
import { TOGGLE_DROPDOWN } from '../../../constants/actionTypes';

const reducerName = 'networkDropdown';

const INITIAL_STATE = {
  visible: false
};

clearAll(); // remove when finished

export default (storeParam, action) => {
  const payload = action.payload;

  if (!get(reducerName)) {
    set(reducerName, INITIAL_STATE);
  }

  const state = get(reducerName);

  switch (action.type) {
    case TOGGLE_DROPDOWN:
      return set(reducerName, { ...state, visible: payload });

    default:
      return get(reducerName);
  }
};
