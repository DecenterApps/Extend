import {
  SET_ADDRESS, SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS,
  SET_IS_USER_VERIFIED, SELECT_NETWORK, ACCEPT_PRIVACY_NOTICE
} from '../../../constants/actionTypes';
import { NETWORKS } from '../../../constants/general';

export const reducerName = 'user';

const INITIAL_STATE = {
  acceptedNotice: false,
  generatedVault: false,
  address: '',
  network: '',
  registering: false,
  registeringError: '',
  username: '',
  verified: false,
  networks: NETWORKS,
  selectedNetwork: NETWORKS[0]
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ACCEPT_PRIVACY_NOTICE:
      return { ...state, acceptedNotice: true };

    case SET_ADDRESS:
      return { ...state, address: payload };

    case SET_NETWORK:
      return { ...state, network: payload };

    case REGISTER_USER:
      return { ...state, registering: true };

    case REGISTER_USER_ERROR:
      return { ...state, registering: false, registeringError: 'Registering user error' };

    case REGISTER_USER_SUCCESS:
      return { ...state, registering: false, registeringError: '', username: payload };

    case SET_IS_USER_VERIFIED:
      return { ...state, verified: payload };

    case SELECT_NETWORK:
      return { ...state, selectedNetwork: NETWORKS[payload] };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
