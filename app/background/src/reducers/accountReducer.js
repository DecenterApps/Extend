import {
  UNLOCK_ERROR, UNLOCK_SUCCESS, SET_BALANCE, SET_GAS_PRICE,
  SEND, SEND_ERROR, SEND_SUCCESS, CLEAR_REFUND_VALUES, REFUND_AVAILABLE,
  REFUND, REFUND_ERROR, REFUND_SUCCESS, REFUND_UNAVAILABLE, CLEAR_SEND_VALUES, SET_REFUND_FORM_VALUES
} from '../../../constants/actionTypes';

const reducerName = 'account';

const INITIAL_STATE = {
  unlockError: '',
  balance: '',
  gasPrice: 0,
  sending: false,
  sendingSuccess: false,
  sendingError: '',
  refunding: false,
  refundingError: '',
  refundingSuccess: false,
  refundAvailable: true,
  refundTipUsername: '',
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case UNLOCK_SUCCESS:
      return { ...state, unlockError: '' };
    case UNLOCK_ERROR:
      return { ...state, unlockError: 'Passphrase not valid' };

    case SET_BALANCE:
      return { ...state, balance: payload };

    case SET_GAS_PRICE:
      return { ...state, gasPrice: payload };

    case SEND:
      return { ...state, sending: true };
    case SEND_SUCCESS:
      return{ ...state, sending: false, sendingSuccess: true, sendingError: '' };
    case SEND_ERROR:
      return {
        ...state,
        sending: false,
        sendingSuccess: false,
        sendingError: 'An error occurred while sending ETH, please try again.'
      };
    case CLEAR_SEND_VALUES:
      return{ ...state, sending: false, sendingSuccess: false, sendingError: '' };

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
      return { ...state,
        refundAvailable: true,
        refunding: false,
        refundingError: '',
        refundingSuccess: false,
        refundTipUsername: ''
      };
    case SET_REFUND_FORM_VALUES:
      return { ...state, refundTipUsername: payload };

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
