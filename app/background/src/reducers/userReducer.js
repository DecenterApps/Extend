import {
  SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE, NETWORK_UNAVAILABLE,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB
} from '../../../constants/actionTypes';
import { NETWORKS, TABS } from '../../../constants/general';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  networkActive: true,
  acceptedNotice: false,
  address: '',
  network: '',
  registering: false,
  registeringError: '',
  verified: false,
  verifiedUsername: '',
  registeringUsername: '',
  selectedNetwork: NETWORKS[2],
  sendingTip: false,
  sendingTipError: '',
  activeTab: TABS[0]
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ACCEPT_PRIVACY_NOTICE:
      return { ...state, acceptedNotice: true };

    case SET_NETWORK:
      return { ...state, network: payload };

    case REGISTER_USER:
      return { ...state, registering: true, registeringUsername: payload, registeringError: '' };

    case VERIFIED_USER:
      return {
        ...state,
        registering: false,
        verified: true,
        registeringUsername: '',
        verifiedUsername: state.registeringUsername,
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

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
