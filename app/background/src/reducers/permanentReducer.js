import {
  REGISTER_USER, ACCEPT_NOTICE, COPIED_SEED, CHANGE_VIEW, SET_DISCONNECTED, CLEAR_REGISTERING_USER, SEEN_DASH,
  CLEAR_SEEN_DASH, MIGRATE_USER, CLEAR_MIGRATING_USER
} from '../../../constants/actionTypes';
import { VIEWS } from '../../../constants/general';

const reducerName = 'permanent';

const INITIAL_STATE = {
  disconnected: false,
  acceptedNotice: false,
  copiedSeed: false,
  registeringUsername: '',
  migratingUsername: '',
  seenDash: false,
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
    case CLEAR_REGISTERING_USER:
      return { ...state, registeringUsername: '' };

    case SEEN_DASH:
      return { ...state, seenDash: true };
    case CLEAR_SEEN_DASH:
      return { ...state, seenDash: false };

    case SET_DISCONNECTED:
      return { ...state, disconnected: payload };

    case MIGRATE_USER:
      return { ...state, migratingUsername: payload };
    case CLEAR_MIGRATING_USER:
      return { ...state, migratingUsername: '' };

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
