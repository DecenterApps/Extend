import { TOGGLE_MODAL } from '../constants/actionTypes';
import { clearTipPending, clearGoldPending } from '../actions/pageActions';

/**
 * Dispatches action to toggle modal. Dispatches on close modal function with a delay if they are defined
 * for the modal type
 *
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {Boolean} payload - to close or to open
 */
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
          break;
      }
    }, 350);
  }

  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType, modalProps, action }
  });
};
