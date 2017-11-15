import { TOGGLE_MODAL } from '../../../constants/actionTypes';

const reducerName = 'modals';

const INITIAL_STATE = {
  modalType: '',
  modalProps: {}
};

const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
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
  handle: reducer,
  async: false
};
