import {
  ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR, SET_TX_COST, SET_TX_VAL, CLEAR_PENDING,
  CLEAR_CURRENT_FORM_TX_VAL
} from '../../../constants/actionTypes';

const reducerName = 'forms';

const INITIAL_STATE = {
  currentFormTxVal: '',
  currentFormTxCost: ''
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `${CLEAR_PENDING}-${reducerName}`:
      return {
        ...state,
        currentFormTxVal: {
          eth: '',
          usd: '',
        },
        currentFormTxCost: {
          eth: '',
          usd: '',
        }
      };

    case ADD_FORM:
      return { ...state, [payload.name]: payload.state };

    case UPDATE_FIELD_META: {
      let currentForm = state[payload.formName];
      currentForm[payload.name] = payload.meta;
      return { ...state, [payload.formName]: currentForm };
    }

    case UPDATE_FIELD_ERROR: {
      let currentForm = state[payload.formName];
      let currentFiled = currentForm[payload.name];

      currentFiled.error = payload.error;
      currentForm[payload.name] = currentFiled;

      return { ...state, [payload.formName]: currentForm };
    }

    case SET_TX_COST:
      return { ...state, currentFormTxCost: payload };
    case SET_TX_VAL:
      return { ...state, currentFormTxVal: payload };
    case CLEAR_CURRENT_FORM_TX_VAL:
      return { ...state, currentFormTxVal: '', currentFormTxCost: '' };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
