import { ACCEPT_NOTICE, COPIED_SEED } from '../../../constants/actionTypes';

const reducerName = 'permanent';

const INITIAL_STATE = {
  acceptedNotice: false,
  copiedSeed: false,
  registering: false,
  registeringUsername: '',
  registeringError: '',
  verified: false,
  verifiedUsername: '',
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ACCEPT_NOTICE:
      return { ...state, acceptedNotice: true };

    case COPIED_SEED:
      return { ...state, copiedSeed: true };

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
