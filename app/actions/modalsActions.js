import { TOGGLE_MODAL } from '../constants/actionTypes';

export const toggleModal = (dispatch, payload) => {
  const { modalType, modalProps, action } = payload;
  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType, modalProps, action }
  });
};
