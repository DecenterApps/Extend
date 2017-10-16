import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK
} from '../../../constants/actionTypes';

const reducerName = 'account';

const INITIAL_STATE = {
  created: false,
  copiedSeed: false,
  address: '',
  password: '',
  keyStore: '',
  seed: '',
  unlockError: ''
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case CREATE_WALLET:
      return { ...state, created: true, ...payload };

    case COPIED_SEED:
      return { ...state, copiedSeed: true };

    case CLEAR_PASSWORD:
      return { ...state, password: '' };

    case UNLOCK:
      return { ...state, password: payload, unlockError: '' };

    case UNLOCK_ERROR:
      return { ...state, unlockError: 'Password not valid' };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
