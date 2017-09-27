import React from 'react';
import { SET_ADDRESS, SET_NETWORK } from '../../../constants/actionTypes';

const INITIAL_STATE = {
  address: '',
  network: ''
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
    case SET_ADDRESS:
      return { ...state, address: payload };

    case SET_NETWORK:
      return { ...state, network: payload };

    default:
      return state;
  }
};
