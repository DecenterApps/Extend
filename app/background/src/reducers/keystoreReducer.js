import { CREATE_WALLET, CLEAR_PASSWORD } from '../../../constants/actionTypes';

const reducerName = 'keyStore';

const INITIAL_STATE = {
  address: '',
  password: '',
  created: false,
  keyStore: {},
  seed: '',
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case CREATE_WALLET:
      return { ...state, created: true, ...payload };

    case CLEAR_PASSWORD:
      return { ...state, password: '' };

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
