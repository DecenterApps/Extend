import React from 'react';
import {
  SET_ADDRESS, SET_NETWORK, REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS
} from '../../../constants/actionTypes';

const INITIAL_STATE = {
  address: '',
  network: '',
  registering: false,
  registeringError: '',
  username: ''
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
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

    default:
      return state;
  }
};
