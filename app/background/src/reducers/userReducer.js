import {
  SET_ADDRESS, SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS,
  SET_IS_USER_VERIFIED, SELECT_NETWORK
} from '../../../constants/actionTypes';
import { NETWORKS } from '../../../constants/general';
import { set, get } from '../../../customRedux/store';
import { createReducerData } from '../../../actions/utils';

export const reducerName = 'user';

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

export const reducerData = createReducerData(reducerName, INITIAL_STATE);

export const reducer = async (storeParam, action) => {
  const payload = action.payload;

  const state = await get(reducerName);

  switch (action.type) {
    case SET_ADDRESS:
      await set(reducerName, { ...state, address: payload });
      break;

    case SET_NETWORK:
      await set(reducerName, { ...state, network: payload });
      break;

    case REGISTER_USER:
      await set(reducerName, { ...state, registering: true });
      break;

    case REGISTER_USER_ERROR:
      await set(reducerName, { ...state, registering: false, registeringError: 'Registering user error' });
      break;

    case REGISTER_USER_SUCCESS:
      await set(reducerName, { ...state, registering: false, registeringError: '', username: payload });
      break;

    case SET_IS_USER_VERIFIED:
      await set(reducerName, { ...state, verified: payload });
      break;

    case SELECT_NETWORK:
      await set(reducerName, { ...state, selectedNetwork: NETWORKS[payload] });
      break;

    default:
      break;
  }
};
