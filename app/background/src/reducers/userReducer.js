import {
  REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  NETWORK_UNAVAILABLE,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB,
  GET_SENT_TIPS, GET_SENT_TIPS_SUCCESS, GET_SENT_TIPS_ERROR,
  GET_RECEIVED_TIPS, GET_RECEIVED_TIPS_SUCCESS, GET_RECEIVED_TIPS_ERROR,
  CHANGE_VIEW
} from '../../../constants/actionTypes';
import { NETWORK_URL, TABS, VIEWS } from '../../../constants/general';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  networkActive: true,
  acceptedNotice: false,
  registering: false,
  registeringError: '',
  verified: false,
  verifiedUsername: '',
  verifiedUsernameSha3: '',
  registeringUsername: '',
  registeringUsernameSha3: '',
  networkUrl: NETWORK_URL,
  sendingTip: false,
  sendingTipError: '',
  activeTab: TABS[0],
  gettingSentTips: false,
  gettingSentTipsError: '',
  sentTips: [],
  gettingReceivedTips: false,
  gettingReceivedTipsError: '',
  receivedTips: [],
  view: VIEWS[0]
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        registering: true,
        registeringUsername: payload.username,
        registeringUsernameSha3: payload.sha3Username,
        registeringError: ''
      };
    case VERIFIED_USER:
      return {
        ...state,
        registering: false,
        verified: true,
        registeringUsername: '',
        registeringUsernameSha3: '',
        verifiedUsername: state.registeringUsername,
        verifiedUsernameSha3: state.registeringUsernameSha3,
        activeTab: TABS[1]
      };

    case REGISTER_USER_ERROR:
      return {
        ...state,
        registering: false,
        registeringError: 'An error occurred while registering your username, please try again.'
      };

    case SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };

    case NETWORK_UNAVAILABLE:
      return { ...state, networkActive: false };

    case SEND_TIP:
      return { ...state, sendingTip: true };

    case SEND_TIP_SUCCESS:
      return { ...state, sendingTip: false, sendingTipError: '' };

    case SEND_TIP_ERROR:
      return {
        ...state,
        sendingTip: false,
        sendingTipError: 'An error occurred while sending tip, please try again.'
      };

    case GET_SENT_TIPS:
      return { ...state, gettingSentTips: true };
    case GET_SENT_TIPS_SUCCESS:
      return { ...state, sentTips: payload, gettingSentTips: false, gettingSentTipsError: '' };
    case GET_SENT_TIPS_ERROR:
      return {
        ...state,
        gettingSentTips: false,
        gettingSentTipsError: 'An error occurred while getting sent tips, please try again.'
      };

    case GET_RECEIVED_TIPS:
      return { ...state, gettingReceivedTips: true };
    case GET_RECEIVED_TIPS_SUCCESS:
      return { ...state, receivedTips: payload, gettingReceivedTips: false, gettingReceivedTipsError: '' };
    case GET_RECEIVED_TIPS_ERROR:
      return {
        ...state,
        gettingReceivedTips: false,
        gettingReceivedTipsError: 'An error occurred while getting sent tips, please try again.'
      };

    case CHANGE_VIEW:
      return { ...state, view: payload.viewName, ...payload.additionalChanges };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
