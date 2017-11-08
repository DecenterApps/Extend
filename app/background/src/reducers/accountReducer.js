import {
  CREATE_WALLET, COPIED_SEED, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, CHANGE_TX_STATE, WITHDRAW, WITHDRAW_ERROR, WITHDRAW_SUCCESS,
  SET_TIPS_BALANCE, CLEAR_PENDING, REFUND, REFUND_ERROR, REFUND_SUCCESS, REFUND_UNAVAILABLE,
  CLEAR_REFUND_VALUES, REFUND_AVAILABLE
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
  balance: '',
  gasPrice: 0,
  transactions: [],
  sending: false,
  sendingError: '',
  withdrawing: false,
  withdrawingError: '',
  tipsBalance: '0',
  refunding: false,
  refundingError: '',
  refundAvailable: true
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `${CLEAR_PENDING}-${reducerName}`:
      return {
        ...state,
        unlockError: '',
        sending: false,
        sendingError: '',
        withdrawing: false,
        withdrawingError: '',
        refunding: false,
        refundingError: '',
        refundAvailable: true
      };

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

    case SEND_SUCCESS: {
      let transactions = [...state.transactions];
      if (transactions.length > 10) transactions.pop();

      return { ...state, sending: false, transactions: [payload, ...transactions], sendingError: '' };
    }

    case SEND_ERROR:
      return { ...state, sending: false, sendingError: 'An error occurred while sending ETH, please try again.' };

    case CHANGE_TX_STATE: {
      const newTransactions = [...state.transactions];
      newTransactions[payload].state = 'mined';
      return { ...state, transactions: newTransactions };
    }

    case WITHDRAW:
      return { ...state, withdrawing: true };
    case WITHDRAW_SUCCESS:
      return { ...state, withdrawing: false, withdrawingError: '' };
    case WITHDRAW_ERROR:
      return {
        ...state,
        withdrawing: false,
        withdrawingError: 'An error occurred while withdrawing ETH, please try again.'
      };

    case REFUND:
      return { ...state, refunding: true };
    case REFUND_SUCCESS:
      return { ...state, refunding: false, refundingError: '', refundAvailable: true };
    case REFUND_ERROR:
      return {
        ...state,
        refunding: false,
        refundAvailable: true,
        refundingError: 'An error occurred while refunding ETH, please try again.'
      };
    case REFUND_UNAVAILABLE:
      return { ...state, refundAvailable: false, refundingError: '' };
    case REFUND_AVAILABLE:
      return { ...state, refundAvailable: true, refundingError: '' };
    case CLEAR_REFUND_VALUES:
      return { ...state, refundAvailable: true, refunding: false, refundingError: '' };


    case SET_TIPS_BALANCE:
      return { ...state, tipsBalance: payload };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
