import {
  SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE, NETWORK_UNAVAILABLE,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR
} from '../../../constants/actionTypes';
import { NETWORKS } from '../../../constants/general';

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
  sendingTipError: ''
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
        registeringUsername: '',
        verifiedUsername: state.registeringUsername
      };

    case REGISTER_USER_ERROR:
      return {
        ...state,
        registering: false,
        registeringError: 'An error occurred while registering your username, please try again.'
      };

    case SELECT_NETWORK:
      return { ...state, selectedNetwork: NETWORKS[payload] };

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
