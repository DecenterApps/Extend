import {
  UNLOCK_ERROR, UNLOCK_SUCCESS, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, CHANGE_TX_STATE, CLEAR_REFUND_VALUES, REFUND_AVAILABLE,
  REFUND, REFUND_ERROR, REFUND_SUCCESS, REFUND_UNAVAILABLE,
} from '../../../constants/actionTypes';

const reducerName = 'account';

const INITIAL_STATE = {
  unlockError: '',
  balance: '',
  gasPrice: 0,
  transactions: [],
  sending: false,
  sendingError: '',
  refunding: false,
  refundingError: '',
  refundingSuccess: false,
  refundAvailable: true
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case UNLOCK_SUCCESS:
      return { ...state, unlockError: '' };
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

    case REFUND:
      return { ...state, refunding: true };
    case REFUND_SUCCESS:
      return { ...state, refunding: false, refundingError: '', refundingSuccess: true, refundAvailable: true };
    case REFUND_ERROR:
      return {
        ...state,
        refunding: false,
        refundAvailable: true,
        refundingSuccess: false,
        refundingError: 'An error occurred while refunding ETH, please try again.'
      };
    case REFUND_UNAVAILABLE:
      return { ...state, refundAvailable: false, refundingError: '', refundingSuccess: false };
    case REFUND_AVAILABLE:
      return { ...state, refundAvailable: true, refundingError: '', refundingSuccess: false };
    case CLEAR_REFUND_VALUES:
      return { ...state, refundAvailable: true, refunding: false, refundingError: '', refundingSuccess: false };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer,
  async: false
};
