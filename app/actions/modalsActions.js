import { TOGGLE_MODAL } from '../constants/actionTypes';
import { clearTipPending, clearGoldPending } from '../actions/pageActions';

export const toggleModal = (dispatch, getState, payload) => {
  const { modalType, modalProps, action } = payload;

  if (action === false) {
    const currentModalType = getState().modals.modalType;

    setTimeout(() => {
      switch (currentModalType) {
        case 'tip_modal':
          clearTipPending(dispatch);
          break;
        case 'gold_modal':
          clearGoldPending(dispatch);
          break;
        default:
          console.log('Modal does not have form or clear function not defined');
      }
    }, 350);
  }

  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType, modalProps, action }
  });
};
