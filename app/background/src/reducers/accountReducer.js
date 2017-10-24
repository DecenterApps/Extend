import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, CHANGE_TX_STATE
} from '../../../constants/actionTypes';

const reducerName = 'account';

const INITIAL_STATE = {
  created: false,
  copiedSeed: false,
  address: '',
  password: '',
  keyStore: {},
  seed: '',
  unlockError: '',
  accountIcon: '',
  balance: '',
  gasPrice: 0,
  transactions: [],
  sending: false,
  sendingError: ''
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

    case SET_BALANCE:
      return { ...state, balance: payload };

    case SET_GAS_PRICE:
      return { ...state, gasPrice: payload };

    case SEND:
      return { ...state, sending: true };

    case SEND_SUCCESS:
      // implement that only last 10 addresses were send
      return { ...state, sending: false, transactions: [...state.transactions, payload], sendingError: '' };

    case SEND_ERROR:
      return { ...state, sending: false, sendingError: 'An error occurred while sending ETH, please try again.' };

    case CHANGE_TX_STATE: {
      const newTransactions = [...state.transactions];
      newTransactions[payload].state = 'mined';
      return { ...state, transactions: newTransactions };
    }

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
