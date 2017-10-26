import {
  SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE, NETWORK_UNAVAILABLE,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB,
  GET_SENT_TIPS, GET_SENT_TIPS_SUCCESS, GET_SENT_TIPS_ERROR
} from '../../../constants/actionTypes';
import { NETWORKS, TABS } from '../../../constants/general';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  networkActive: true,
  acceptedNotice: false,
  network: '',
  registering: false,
  registeringError: '',
  verified: false,
  verifiedUsername: '',
  verifiedUsernameSha3: '',
  registeringUsername: '',
  registeringUsernameSha3: '',
  selectedNetwork: NETWORKS[2],
  sendingTip: false,
  sendingTipError: '',
  activeTab: TABS[0],
  gettingSentTips: false,
  gettingSentTipsError: '',
  sentTips: []
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ACCEPT_PRIVACY_NOTICE:
      return { ...state, acceptedNotice: true };

    case SET_NETWORK:
      return { ...state, network: payload };

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

    case SELECT_NETWORK:
      return { ...state, selectedNetwork: NETWORKS[payload] };

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

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
