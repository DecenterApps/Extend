import { TOGGLE_MODAL, CLEAR_PENDING } from '../../../constants/actionTypes';

const reducerName = 'modals';

const INITIAL_STATE = {
  modalType: '',
  modalProps: {}
};

const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `${CLEAR_PENDING}-${reducerName}`:
      return {
        ...state,
        modalType: '',
        modalProps: {}
      };
    case TOGGLE_MODAL: {
      const close = !payload.action;

      if (close) {
        return INITIAL_STATE;
      }

      return {
        modalType: payload.modalType,
        modalProps: payload.modalProps
      };
    }

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
