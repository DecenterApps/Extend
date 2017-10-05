import {
  SET_ADDRESS, SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS,
  SET_IS_USER_VERIFIED, SELECT_NETWORK
} from '../../../constants/actionTypes';
import { NETWORKS } from '../../../constants/general';
import { set, get, clearAll } from '../../../actions/storageActions';

const reducerName = 'user';

const INITIAL_STATE = {
  address: '',
  network: '',
  registering: false,
  registeringError: '',
  username: '',
  verified: false,
  networks: NETWORKS,
  selectedNetwork: NETWORKS[0]
};

clearAll(); // remove when finished

export default (storeParam, action) => {
  const payload = action.payload;

  if (!get(reducerName)) {
    set(reducerName, INITIAL_STATE);
  }

  const state = get(reducerName);

  switch (action.type) {
    case SET_ADDRESS:
      return set(reducerName, { ...state, address: payload });

    case SET_NETWORK:
      return set(reducerName, { ...state, network: payload });

    case REGISTER_USER:
      return set(reducerName, { ...state, registering: true });

    case REGISTER_USER_ERROR:
      return set(reducerName, { ...state, registering: false, registeringError: 'Registering user error' });

    case REGISTER_USER_SUCCESS:
      return set(reducerName, { ...state, registering: false, registeringError: '', username: payload });

    case SET_IS_USER_VERIFIED:
      return set(reducerName, { ...state, verified: payload });

    case SELECT_NETWORK:
      return set(reducerName, { ...state, selectedNetwork: NETWORKS[payload] });

    default:
      return get(reducerName);
  }
};
