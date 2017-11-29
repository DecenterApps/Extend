import {
  NETWORK_UNAVAILABLE, ADD_NEW_TIP, VERIFIED_USER, CLEAR_VERIFIED,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB,
  GET_TIPS, GET_TIPS_SUCCESS, GET_TIPS_ERROR, CLEAR_TIP_PENDING,
  CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR,
  BUY_GOLD, BUY_GOLD_SUCCESS, BUY_GOLD_ERROR, GET_GOLD, GET_GOLD_ERROR, CLEAR_GOLD_PENDING,
  GET_GOLD_SUCCESS, ADD_NEW_GOLD, SET_REFUND_TIPS, DIALOG_OPEN, ADD_TAB_ID, REMOVE_TAB_ID,
  CLEAR_REGISTERING_ERROR, REGISTER_USER_ERROR, SET_OLD_USER, CLEAR_OLD_USER
} from '../../../constants/actionTypes';
import { TABS } from '../../../constants/general';
import { NETWORK_URL } from '../../../constants/config';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  registeringError: '',
  verifiedUsername: '',
  networkActive: true,
  networkUrl: NETWORK_URL,
  sendingTip: false,
  sendingTipError: '',
  sendingTipSuccess: false,
  activeTab: TABS[0].slug,
  gettingTips: false,
  gettingTipsError: '',
  tips: [],
  connectingAgain: false,
  connectingAgainError: '',
  buyingGold: false,
  buyingGoldError: '',
  buyingGoldSuccess: false,
  golds: [],
  gettingGold: false,
  gettingGoldError: '',
  dialogWindowId: 0,
  tabsIds: [],
  oldUsername: ''
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case DIALOG_OPEN:
      return {
        ...state,
        dialogWindowId: action.id,
      };

    case SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };

    case NETWORK_UNAVAILABLE:
      return { ...state, networkActive: false };

    case VERIFIED_USER:
      return { ...state, verifiedUsername: payload };
    case CLEAR_VERIFIED:
      return { ...state, verifiedUsername: '', tips: [], golds: [] };

    case REGISTER_USER_ERROR:
      return { ...state, registeringError: action.message, };

    case CLEAR_REGISTERING_ERROR:
      return { ...state, registeringError: '' };

    case SEND_TIP:
      return { ...state, sendingTip: true };
    case SEND_TIP_SUCCESS:
      return { ...state, sendingTip: false, sendingTipError: '', sendingTipSuccess: true };
    case SEND_TIP_ERROR:
      return {
        ...state,
        sendingTip: false,
        sendingTipSuccess: false,
        sendingTipError: 'An error occurred while sending tip, please try again.'
      };
    case CLEAR_TIP_PENDING:
      return {
        ...state,
        sendingTip: false,
        sendingTipSuccess: false,
        sendingTipError: ''
      };

    case GET_TIPS:
      return { ...state, gettingTips: true };
    case GET_TIPS_SUCCESS:
      return {
        ...state,
        tips: payload,
        gettingTips: false,
        gettingTipsError: ''
      };
    case GET_TIPS_ERROR:
      return {
        ...state,
        gettingTips: false,
        gettingTipsError: 'An error occurred while getting tips, please try again.'
      };
    case ADD_NEW_TIP: {
      return { ...state, tips: payload };
    }

    case GET_GOLD:
      return { ...state, gettingGold: true };
    case GET_GOLD_SUCCESS:
      return {
        ...state,
        golds: payload,
        gettingGold: false,
        gettingGoldError: ''
      };
    case GET_GOLD_ERROR:
      return {
        ...state,
        gettingGold: false,
        gettingGoldError: 'An error occurred while getting gold, please try again.'
      };

    case ADD_NEW_GOLD: {
      return { ...state, golds: payload };
    }

    case CONNECT_AGAIN:
      return { ...state, connectingAgain: true };
    case CONNECT_AGAIN_SUCCESS:
      return { ...state, connectingAgain: false, connectingAgainError: '' };
    case CONNECT_AGAIN_ERROR:
      return {
        ...state,
        connectingAgain: false,
        connectingAgainError: 'Still could not connect, please try again.'
      };

    case BUY_GOLD:
      return { ...state, buyingGold: true };
    case BUY_GOLD_SUCCESS:
      return { ...state, buyingGold: false, buyingGoldError: '', buyingGoldSuccess: true };
    case BUY_GOLD_ERROR:
      return {
        ...state,
        buyingGold: false,
        buyingGoldSuccess: false,
        buyingGoldError: 'An error occurred while buying gold, please try again.'
      };
    case CLEAR_GOLD_PENDING:
      return {
        ...state,
        buyingGold: false,
        buyingGoldSuccess: false,
        buyingGoldError: ''
      };

    case SET_REFUND_TIPS:
      return { ...state, tips: payload };

    case ADD_TAB_ID:
      return { ...state, tabsIds: [...state.tabsIds, payload] };

    case REMOVE_TAB_ID: {
      let allTabIds = [state.tabsIds];
      const tabIndex = allTabIds.findIndex((id) => id === payload);
      allTabIds = allTabIds.splice(tabIndex, 1);

      return { ...state, tabsIds: allTabIds };
    }

    case SET_OLD_USER:
      return { ...state, oldUsername: payload };
    case CLEAR_OLD_USER:
      return { ...state, oldUsername: '' };


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
