import { CREATE_WALLET, COPIED_SEED } from '../../../constants/actionTypes';

const reducerName = 'account';

const INITIAL_STATE = {
  created: false,
  copiedSeed: false,
  address: '',
  privateKey: '',
  keyStore: '',
  seed: ''
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case CREATE_WALLET:
      return { ...state, created: true, ...payload };

    case COPIED_SEED:
      return { ...state, copiedSeed: true };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
