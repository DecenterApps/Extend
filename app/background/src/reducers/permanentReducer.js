import {
  REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW, SET_DISCONNECTED
} from '../../../constants/actionTypes';
import { VIEWS } from '../../../constants/general';

const reducerName = 'permanent';

const INITIAL_STATE = {
  disconnected: false,
  acceptedNotice: false,
  copiedSeed: false,
  registering: false,
  registeringUsername: '',
  registeringError: '',
  verified: false,
  verifiedUsername: '',
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
      return {
        ...state,
        registering: true,
        registeringUsername: payload.username,
        registeringError: ''
      };

    case REGISTER_USER_ERROR:
      return {
        ...state,
        registering: false,
        registeringError: action.message,
      };

    case VERIFIED_USER:
      return {
        ...state,
        registering: false,
        verified: true,
        registeringUsername: '',
        verifiedUsername: state.registeringUsername,
      };

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
