import {
  REGISTER_USER, ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW, SET_DISCONNECTED, CLEAR_REGISTER_USER
} from '../../../constants/actionTypes';
import { VIEWS } from '../../../constants/general';

const reducerName = 'permanent';

const INITIAL_STATE = {
  disconnected: false,
  acceptedNotice: false,
  copiedSeed: false,
  registeringUsername: '',
  view: VIEWS[0]
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ACCEPT_NOTICE:
      return { ...state, acceptedNotice: true };

    case COPIED_SEED:
      return { ...state, copiedSeed: true };

    case CHANGE_VIEW:
      return { ...state, view: payload.viewName };

    case REGISTER_USER:
      return { ...state, registeringUsername: payload.username };

    case CLEAR_REGISTER_USER:
      return { ...state, registeringUsername: '' };

    case SET_DISCONNECTED:
      return { ...state, disconnected: payload };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer,
  async: true
};
